import crypto from "node:crypto";
import type {
  AcceptInvitationResult,
  InvitationBatch,
  Invitee,
  InviteeContactType,
} from "../types/invitation";
import axios from "axios";
import { buildJitsiJwt } from "../helper/helper";
import { hasDoctorJoined } from "../websocket";
import { updateProvider } from "./providers.service";
import { updateFamilyAndFriends } from "./family-friends.service";
import { prisma } from "../config/prisma.js";

type CreateInvitationInputMember = {
  name: string;
  relation: string;
  phone: string;
  email: string;
  id: string;
  invite?: boolean;
  status?: string;
  type: string;
};

type CreateInvitationInput = {
  patientId: string;
  members: CreateInvitationInputMember[];
  doctorPhone?: string;
};

const invitationBatches = new Map<string, InvitationBatch>();
const inviteIdToBatchId = new Map<string, string>();
const waitingRoomReminderSent = new Set<string>();
const waitingRoomTimers = new Map<string, NodeJS.Timeout>();

export const WAITING_ROOM_REMINDER_DELAY_MS = 3 * 60 * 1000;
const DEFAULT_INVITATION_EXPIRY_HOURS = 24;

function getInvitationExpiryMs(): number {
  const configuredHours = Number(process.env.INVITATION_EXPIRY_HOURS);
  const hours =
    Number.isFinite(configuredHours) && configuredHours > 0
      ? configuredHours
      : DEFAULT_INVITATION_EXPIRY_HOURS;

  return hours * 60 * 60 * 1000;
}

function isInvitationBatchStale(batch: InvitationBatch): boolean {
  if (!["waiting", "accepted"].includes(batch.status)) return false;

  const invitedAt = new Date(batch.invitedAt).getTime();
  return (
    Number.isNaN(invitedAt) || Date.now() - invitedAt >= getInvitationExpiryMs()
  );
}

function genId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function buildRoomId(patientId: string): string {
  return `patient-${patientId}-${Date.now()}`;
}

function normalizeContactType(type: string): InviteeContactType {
  const normalized = type.trim().toLowerCase();
  if (normalized === "provider") return "provider";
  if (normalized === "patient") return "patient";
  if (["family", "friend", "guest"].includes(normalized)) return "family";

  throw new Error(
    `Invalid member type "${type}". Expected provider, patient, guest, family, or friend`,
  );
}

const JITSI_BASE_URL =
  process.env.JITSI_BASE_URL || "https://meet.bulmartech.com";

export async function persistInvitationBatch(
  batch: InvitationBatch,
): Promise<void> {
  await prisma.invitationBatchRecord.upsert({
    where: { inviteBatchId: batch.inviteBatchId },
    create: {
      inviteBatchId: batch.inviteBatchId,
      patientId: batch.patientId,
      roomId: batch.roomId,
      meetingUrl: batch.meetingUrl,
      status: batch.status,
      invitedAt: new Date(batch.invitedAt),
      acceptedBy: batch.acceptedBy ?? null,
      acceptedAt: batch.acceptedAt ? new Date(batch.acceptedAt) : null,
      waitingStartedAt: batch.waitingStartedAt
        ? new Date(batch.waitingStartedAt)
        : null,
      doctorPhone: batch.doctorPhone ?? null,
      invitees: JSON.parse(JSON.stringify(batch.invitees)),
    },
    update: {
      status: batch.status,
      acceptedBy: batch.acceptedBy ?? null,
      acceptedAt: batch.acceptedAt ? new Date(batch.acceptedAt) : null,
      waitingStartedAt: batch.waitingStartedAt
        ? new Date(batch.waitingStartedAt)
        : null,
      doctorPhone: batch.doctorPhone ?? null,
      invitees: JSON.parse(JSON.stringify(batch.invitees)),
    },
  });
}

export async function getActiveInvitationBatch(
  patientId: string,
): Promise<InvitationBatch | null> {
  const record = await prisma.invitationBatchRecord.findFirst({
    where: { patientId, status: { in: ["waiting", "accepted"] } },
    orderBy: { updatedAt: "desc" },
  });
  if (!record) {
    const expiredRecords = await prisma.invitationBatchRecord.findMany({
      where: { patientId, status: "expired" },
      select: { invitees: true },
    });
    if (expiredRecords.length > 0) {
      const expiredInvitees = expiredRecords.flatMap(
        (expiredRecord) => expiredRecord.invitees as unknown as Invitee[],
      );
      await resetExpiredParticipantRecords(expiredInvitees);
    }
    return null;
  }

  const batch: InvitationBatch = {
    inviteBatchId: record.inviteBatchId,
    patientId: record.patientId,
    roomId: record.roomId,
    meetingUrl: record.meetingUrl,
    status: record.status as InvitationBatch["status"],
    invitedAt: record.invitedAt.toISOString(),
    ...(record.acceptedBy ? { acceptedBy: record.acceptedBy } : {}),
    ...(record.acceptedAt
      ? { acceptedAt: record.acceptedAt.toISOString() }
      : {}),
    ...(record.waitingStartedAt
      ? { waitingStartedAt: record.waitingStartedAt.toISOString() }
      : {}),
    ...(record.doctorPhone ? { doctorPhone: record.doctorPhone } : {}),
    invitees: record.invitees as unknown as Invitee[],
  };

  invitationBatches.set(batch.inviteBatchId, batch);
  batch.invitees.forEach((invitee) =>
    inviteIdToBatchId.set(invitee.inviteId, batch.inviteBatchId),
  );

  if (await expireInvitationBatchIfStale(batch)) return null;

  return batch;
}

export function createInvitations(
  input: CreateInvitationInput,
): InvitationBatch {
  const inviteBatchId = genId("batch");
  const roomId = buildRoomId(input.patientId);

  const invitees: Invitee[] = input.members.map((m) => {
    const inviteId = genId("inv");
    inviteIdToBatchId.set(inviteId, inviteBatchId);
    return {
      inviteId,
      name: m.name,
      relation: m.relation,
      phone: m.phone,
      email: m.email,
      status: m.status ?? "",
      id: m.id,
      type: normalizeContactType(m.type),
    };
  });

  const batch: InvitationBatch = {
    inviteBatchId,
    patientId: input.patientId,
    roomId,
    meetingUrl: `${JITSI_BASE_URL}/${roomId}`,
    status: "waiting",
    invitedAt: new Date().toISOString(),
    invitees,
    ...(input.doctorPhone ? { doctorPhone: input.doctorPhone } : {}),
  };

  invitationBatches.set(inviteBatchId, batch);
  return batch;
}

export async function acceptInvitation(
  inviteId: string,
): Promise<AcceptInvitationResult | null> {
  const batchId = inviteIdToBatchId.get(inviteId);
  if (!batchId) return null;

  const batch = invitationBatches.get(batchId);
  if (!batch) return null;

  const invitee = batch.invitees.find((i) => i.inviteId === inviteId);
  if (!invitee) return null;

  await expireInvitationBatchIfStale(batch);

  if (batch.status === "concluded" || batch.status === "expired") {
    return { batch, invitee };
  }

  const now = new Date().toISOString();
  invitee.status = "accepted";
  invitee.acceptedAt = now;

  if (batch.status !== "accepted") {
    batch.status = "accepted";
    batch.acceptedBy = inviteId;
    batch.acceptedAt = now;
  }

  return { batch, invitee };
}

export async function concludeMeeting(inviteBatchId: string): Promise<boolean> {
  const result = await prisma.invitationBatchRecord.updateMany({
    where: { inviteBatchId },
    data: { status: "concluded" },
  });

  if (result.count === 0) return false;

  const cachedBatch = invitationBatches.get(inviteBatchId);
  if (cachedBatch) cachedBatch.status = "concluded";

  return true;
}

async function expireInvitationBatchIfStale(
  batch: InvitationBatch,
): Promise<boolean> {
  if (!isInvitationBatchStale(batch)) return false;

  batch.status = "expired";
  batch.invitees.forEach((invitee) => {
    invitee.status = "-";
  });
  await persistInvitationBatch(batch);
  cancelWaitingRoomReminder(batch.inviteBatchId);
  await resetMeetingParticipants(batch.inviteBatchId);
  return true;
}
export function getBatchStatus(inviteBatchId: string): InvitationBatch | null {
  return invitationBatches.get(inviteBatchId) ?? null;
}

/**
 * Records the server-side timestamp when the first guest enters the waiting room.
 * Called from the WebSocket handler on "guest_waiting" event.
 * Only sets it once (does not overwrite if already set).
 */
export function setWaitingStartedAt(inviteBatchId: string): void {
  const batch = invitationBatches.get(inviteBatchId);
  if (batch && !batch.waitingStartedAt) {
    batch.waitingStartedAt = new Date().toISOString();
    void persistInvitationBatch(batch);
    scheduleWaitingRoomReminder(inviteBatchId);
  }
}

export function cancelWaitingRoomReminder(inviteBatchId: string): void {
  const timer = waitingRoomTimers.get(inviteBatchId);
  if (!timer) return;

  clearTimeout(timer);
  waitingRoomTimers.delete(inviteBatchId);
}

function buildModeratorMeetingUrl(batch: InvitationBatch): string {
  const moderatorToken = buildJitsiJwt({
    room: batch.roomId,
    userId: batch.patientId,
    name: "Doctor",
    email: "",
    moderator: true,
    affiliation: "owner",
    type: "provider",
  });

  return `${JITSI_BASE_URL}/${batch.roomId}?jwt=${moderatorToken}&moderator=true`;
}

function scheduleWaitingRoomReminder(inviteBatchId: string): void {
  if (waitingRoomTimers.has(inviteBatchId)) return;

  const timer = setTimeout(() => {
    waitingRoomTimers.delete(inviteBatchId);

    void (async () => {
      const batch = invitationBatches.get(inviteBatchId);
      if (!batch) return;

      try {
        const result = await sendWaitingRoomReminder({
          inviteBatchId,
          meetingUrl: buildModeratorMeetingUrl(batch),
        });

        if (result.sent) {
          console.log(
            `Waiting room reminder SMS sent for batch ${inviteBatchId}`,
          );
        } else {
          console.log(
            `Waiting room reminder skipped for batch ${inviteBatchId}: ${result.reason}`,
          );
        }
      } catch (err) {
        console.error(
          `Failed to send waiting room reminder for batch ${inviteBatchId}:`,
          err,
        );
      }
    })();
  }, WAITING_ROOM_REMINDER_DELAY_MS);

  waitingRoomTimers.set(inviteBatchId, timer);
}

export function addInviteesToBatch(
  inviteBatchId: string,
  members: CreateInvitationInputMember[],
): InvitationBatch {
  const batch = invitationBatches.get(inviteBatchId);

  if (!batch) {
    throw new Error("Invitation batch not found");
  }

  const existingParticipantKeys = new Set(
    batch.invitees.map((invitee) => `${invitee.type}:${invitee.id}`),
  );
  const uniqueMembers = members.filter((member) => {
    const type = normalizeContactType(member.type);
    const key = `${type}:${member.id}`;
    if (existingParticipantKeys.has(key)) return false;
    existingParticipantKeys.add(key);
    return true;
  });

  const newInvitees: Invitee[] = uniqueMembers.map((m) => {
    const inviteId = genId("inv");

    inviteIdToBatchId.set(inviteId, inviteBatchId);

    return {
      inviteId,
      name: m.name,
      relation: m.relation,
      phone: m.phone,
      email: m.email,
      status: m.status ?? "-",
      id: m.id,
      type: normalizeContactType(m.type),
    };
  });

  batch.invitees.push(...newInvitees);

  return batch;
}

export function getInviteById(
  inviteId: string,
): { batch: InvitationBatch; invitee: Invitee } | null {
  const batchId = inviteIdToBatchId.get(inviteId);
  if (!batchId) return null;

  const batch = invitationBatches.get(batchId);
  if (!batch) return null;

  const invitee = batch.invitees.find((i) => i.inviteId === inviteId);
  if (!invitee) return null;

  return { batch, invitee };
}

export async function setInviteeMeetingStatus(
  inviteId: string,
  status: "Joined" | "Left" | "Disconnected",
): Promise<{ batch: InvitationBatch; invitee: Invitee } | null> {
  const invite = getInviteById(inviteId);
  if (!invite) return null;

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
  const displayStatus = `${status} ${time}`;

  invite.invitee.status = displayStatus;

  if (invite.invitee.type === "provider") {
    await updateProvider(invite.invitee.id, { status: displayStatus });
  } else if (invite.invitee.type === "family") {
    await updateFamilyAndFriends(invite.invitee.id, {
      status: displayStatus,
    });
  }

  await persistInvitationBatch(invite.batch);
  return invite;
}

const TURBO_API = "https://dids.turbobridge.com/api/1.0/Messages";

export async function sendSMS(
  phone: string,
  message: string,
  countryCode: string = "1",
): Promise<void> {
  const username = process.env.TURBOSMS_USERNAME;
  const password = process.env.TURBOSMS_PASSWORD;
  const partnerId = process.env.TURBOSMS_PARTNER_ID;
  const sender = process.env.TURBOSMS_SENDER;

  if (!username || !password || !partnerId || !sender) {
    throw new Error("TurboSMS credentials not set in .env");
  }

  const formattedPhone = formatPhone(phone, countryCode);

  const turbodata = {
    request: {
      authAdministrator: {
        username,
        password,
      },
      requestList: [
        {
          sendMessage: {
            partnerID: partnerId,
            from: sender,
            to: formattedPhone,
            text: message,
          },
        },
      ],
    },
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(TURBO_API, turbodata, config);

    const requestItem = response.data?.responseList?.requestItem?.[0];
    const result = requestItem?.result;
    const status =
      result?.details?.response?.result?.resultResponses?.[0]?.status;
    const messageId = result?.messageID;

    if (status === "SUCCESS") {
      console.log(`SMS sent to ${formattedPhone} — messageID: ${messageId}`);
    } else {
      console.error(
        `SMS failed for ${formattedPhone}:`,
        JSON.stringify(result),
      );
      throw new Error(`SMS failed with status: ${status}`);
    }
  } catch (error) {
    console.error("SMS send failed:", error);
    throw error;
  }
}

export type WaitingRoomReminderInput = {
  inviteBatchId: string;
  /** Override phone — if absent, the batch's stored doctorPhone is used */
  doctorPhone?: string;
  countryCode?: string;
  guestName?: string;
  /** Fallback timestamp — server-recorded value is preferred */
  waitingStartedAt?: string;
  meetingUrl?: string;
};

export type WaitingRoomReminderResult =
  | { sent: true }
  | { sent: false; reason: "doctor_already_joined" | "reminder_already_sent" };

export async function sendWaitingRoomReminder(
  input: WaitingRoomReminderInput,
): Promise<WaitingRoomReminderResult> {
  const batch = invitationBatches.get(input.inviteBatchId);
  if (!batch) {
    throw new Error("Invitation batch not found");
  }

  // Prefer the server-recorded timestamp; fall back to client-supplied value
  const rawTimestamp = batch.waitingStartedAt ?? input.waitingStartedAt;
  if (!rawTimestamp) {
    throw new Error(
      "Guest has not entered the waiting room yet (waitingStartedAt not recorded)",
    );
  }
  const waitingStartedAt = new Date(rawTimestamp);
  if (Number.isNaN(waitingStartedAt.getTime())) {
    throw new Error(
      "Invalid waitingStartedAt — guest may not have entered the waiting room yet",
    );
  }

  const elapsedMs = Date.now() - waitingStartedAt.getTime();
  if (elapsedMs < WAITING_ROOM_REMINDER_DELAY_MS) {
    const remainingSec = Math.ceil(
      (WAITING_ROOM_REMINDER_DELAY_MS - elapsedMs) / 1000,
    );
    throw new Error(
      `Waiting room reminder can only be sent after 3 minutes. ${remainingSec}s remaining.`,
    );
  }

  if (waitingRoomReminderSent.has(input.inviteBatchId)) {
    return { sent: false, reason: "reminder_already_sent" };
  }

  if (hasDoctorJoined(input.inviteBatchId)) {
    return { sent: false, reason: "doctor_already_joined" };
  }

  // Resolve doctor phone: prefer batch-stored value (set at invite creation), then input override
  const phoneToNotify = batch.doctorPhone ?? input.doctorPhone;
  if (!phoneToNotify) {
    throw new Error(
      "Doctor phone number not available — cannot send reminder SMS",
    );
  }

  const guestLabel = input.guestName?.trim() || "A guest";
  const joinUrl = input.meetingUrl ?? batch.meetingUrl;
  const message = `${guestLabel} has been waiting in the meeting room for 3 minutes. Please join: ${joinUrl}`;

  await sendSMS(phoneToNotify, message, input.countryCode);
  waitingRoomReminderSent.add(input.inviteBatchId);

  return { sent: true };
}

export async function nudgeGuests(
  inviteBatchId: string,
  origin: string,
): Promise<{ sentCount: number }> {
  const batch = invitationBatches.get(inviteBatchId);
  if (!batch) {
    throw new Error("Invitation batch not found");
  }

  const pendingInvitees = batch.invitees.filter((i) => i.status !== "accepted");
  let sentCount = 0;

  for (const invitee of pendingInvitees) {
    if (!invitee.phone) continue;

    const inviteLink = `${origin}/invite/accept?inviteId=${invitee.inviteId}`;
    const message = `Hello ${invitee.name}, the doctor is waiting for you in the virtual consult room. Please join now: ${inviteLink}`;

    try {
      await sendSMS(invitee.phone, message);
      sentCount++;
    } catch (err) {
      console.error(`Failed to nudge ${invitee.name}:`, err);
    }
  }

  return { sentCount };
}

function formatPhone(phone: string, countryCode: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Already has + prefix handled
  if (digits.startsWith(countryCode)) {
    return digits;
  }

  // Add country code
  return `${countryCode}${digits}`;
}

export async function resetMeetingParticipants(
  inviteBatchId: string,
  status = "-",
) {
  const batch = invitationBatches.get(inviteBatchId);

  if (!batch) {
    throw new Error("Invitation batch not found");
  }

  const inviteIds = batch.invitees.map((invitee) => invitee.inviteId);

  await prisma.$transaction([
    prisma.providerAndStaff.updateMany({
      where: { inviteId: { in: inviteIds } },
      data: { invite: false, inviteId: null, status },
    }),
    prisma.familyAndFriends.updateMany({
      where: { inviteId: { in: inviteIds } },
      data: { invite: false, inviteId: null, status },
    }),
  ]);

  invitationBatches.delete(inviteBatchId);
}

async function resetExpiredParticipantRecords(
  invitees: Invitee[],
): Promise<void> {
  const inviteIds = invitees.map((invitee) => invitee.inviteId);

  await prisma.$transaction([
    prisma.providerAndStaff.updateMany({
      where: { inviteId: { in: inviteIds } },
      data: { invite: false, inviteId: null, status: "-" },
    }),
    prisma.familyAndFriends.updateMany({
      where: { inviteId: { in: inviteIds } },
      data: { invite: false, inviteId: null, status: "-" },
    }),
  ]);
}
