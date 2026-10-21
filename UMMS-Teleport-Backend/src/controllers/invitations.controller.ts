import type { Request, Response } from "express";

import {
  acceptInvitation,
  createInvitations,
  getBatchStatus,
  getInviteById,
  sendSMS,
  addInviteesToBatch,
  sendWaitingRoomReminder,
  nudgeGuests,
  concludeMeeting,
  resetMeetingParticipants,
  setInviteeMeetingStatus,
  persistInvitationBatch,
  getActiveInvitationBatch,
} from "../services/invitations.service";
import { buildJitsiJwt, getCurrentTimeFormatted } from "../helper/helper";
import { AcceptInvitationResult } from "../types/invitation";
import {
  notifyBatchUpdate,
  clearDoctorJoined,
} from "../websocket";
import { getPatientById, recordMeeting } from "../services/patients.service";
import type { Invitee, MeetingParticipant } from "../types/invitation";
import { config } from "dotenv";
import { updateProvider } from "../services/providers.service";
import { updateFamilyAndFriends } from "../services/family-friends.service";
const EMR_URL = process.env.EMR_URL!;

config();
const JITSI_DOMAIN = process.env.JITSI_BASE_URL || "meet.bulmartech.com";

function inviteeToParticipant(invitee: Invitee): MeetingParticipant {
  return {
    id: invitee.id,
    inviteId: invitee.inviteId,
    name: invitee.name,
    phone: invitee.phone,
    email: invitee.email,
    relation: invitee.relation,
    status: invitee.status,
    type:
      invitee.type === "provider"
        ? "provider"
        : invitee.type === "patient"
          ? "patient"
          : "guest",
  };
}

export async function createInvitationsController(
  req: Request,
  res: Response,
): Promise<void> {
  // 1. Accept optional roomId and inviteBatchId from the frontend
  const { patientId, members, roomId, inviteBatchId } = req.body ?? {};

  if (!patientId || !Array.isArray(members) || members.length === 0) {
    res.status(400).json({
      message: "patientId and non-empty members array are required",
    });
    return;
  }

  const allowedMemberTypes = new Set(["provider", "guest", "family", "friend"]);
  const invalidMember = members.find(
    (member) =>
      !member ||
      typeof member.type !== "string" ||
      !allowedMemberTypes.has(member.type.trim().toLowerCase()),
  );
  if (invalidMember) {
    res.status(400).json({
      message:
        "Each member must have type provider or guest (family and friend are accepted as guest aliases)",
    });
    return;
  }

  const patient = await getPatientById(String(patientId));

  if (!patient) {
    res.status(404).json({ message: "Patient not found" });
    return;
  }

  const patientMember = {
    id: patient.id,
    name: `${patient.firstName} ${patient.lastName}`.trim(),
    phone: patient.phone,
    email: "",
    relation: "Self",
    status: `Invited ${getCurrentTimeFormatted()}`,
    type: "patient",
  };
  const membersWithPatient = [patientMember, ...members];

  let batch;
  let isNewBatch = false;

  // 2. If inviteBatchId already exists, reuse/append to the existing batch
  if (inviteBatchId) {
    batch = getBatchStatus(inviteBatchId);
    if (batch) {
      try {
        batch = addInviteesToBatch(inviteBatchId, membersWithPatient);
      } catch (err) {
        console.error("Failed to append to batch:", err);
      }
    }
  }

  // 3. If it's a new session, create it from scratch
  if (!batch) {
    batch = createInvitations({
      patientId: String(patientId),
      members: membersWithPatient,
      ...(req.body.phone ? { doctorPhone: String(req.body.phone) } : {}),
    });
    isNewBatch = true;
  }

  // The endpoint is opened by the patient; invited providers and guests get
  // their own non-moderator token when they accept an invitation.
  const moderatorToken = buildJitsiJwt({
    room: batch.roomId,
    userId: String(patientId),
    name: "Doctor",
    email: "",
    moderator: true,
    affiliation: "owner",
    type: "provider",
  });

  const moderatorMeetingUrl = `${JITSI_DOMAIN}/${batch.roomId}?jwt=${moderatorToken}&moderator=true`;

  if (isNewBatch) {
    try {
      await recordMeeting(String(patientId), batch.roomId);
    } catch (err) {
      console.error("Failed to persist meeting record:", err);
    }
  }
  await persistInvitationBatch(batch);

  //update provider and family
  await Promise.all(
    batch.invitees.map(async (invitee) => {
      if (!invitee.id || !invitee.type) return;

      try {
        if (invitee.type === "provider") {
          await updateProvider(invitee.id, {
            invite: true,
            inviteId: invitee.inviteId,
            status: invitee.status,
          });
        } else if (invitee.type === "family") {
          await updateFamilyAndFriends(invitee.id, {
            invite: true,
            inviteId: invitee.inviteId,
            status: invitee.status,
          });
        }
      } catch (error) {
        console.error(
          `Failed to update ${invitee.type} (${invitee.id})`,
          error,
        );
      }
    }),
  );

  // Send SMS to each invitee
  const smsPromises = batch.invitees.map(async (invitee) => {
    if (!invitee.phone) return;

    const inviteLink = `https://bulmartech.com/meeting/${patientId}?room=${batch.roomId}&inviteId=${invitee.inviteId}&moderator=false`;
    const message = `Hello ${invitee.name}, you have been invited to a medical consultation. Join here: ${inviteLink}`;
    console.log(message);

    try {
      await sendSMS(invitee.phone, message);
    } catch (err) {
      console.error(`SMS failed for ${invitee.name}:`, err);
    }
  });

  await Promise.all(smsPromises);

  const invitedParticipants = batch.invitees.map(inviteeToParticipant);

  res.status(201).json({
    inviteBatchId: batch.inviteBatchId,
    roomId: batch.roomId,
    meetingUrl: moderatorMeetingUrl,
    status: batch.status,
    participants: invitedParticipants,
    // Kept for existing clients. Meeting role names are used here too, so a
    // family/friend is consistently returned as a guest.
    invitees: invitedParticipants,
  });
}

export async function getActiveInvitationController(
  req: Request,
  res: Response,
): Promise<void> {
  const patientId = req.query.patientId;
  if (!patientId || typeof patientId !== "string") {
    res.status(400).json({ message: "patientId query param is required" });
    return;
  }

  const batch = await getActiveInvitationBatch(patientId);
  if (!batch) {
    res.status(404).json({ message: "No active invitation batch found" });
    return;
  }

  const moderatorToken = buildJitsiJwt({
    room: batch.roomId,
    userId: batch.patientId,
    name: "Doctor",
    email: "",
    moderator: true,
    affiliation: "owner",
    type: "provider",
  });
  res.json({
    inviteBatchId: batch.inviteBatchId,
    roomId: batch.roomId,
    meetingUrl: `${JITSI_DOMAIN}/${batch.roomId}?jwt=${moderatorToken}&moderator=true`,
    status: batch.status,
  });
}

export async function acceptInvitationController(
  req: Request,
  res: Response,
): Promise<void> {
  const { inviteId } = req.body ?? {};

  if (!inviteId) {
    res.status(400).json({ message: "inviteId is required" });
    return;
  }

  const result = await acceptInvitation(String(inviteId));

  if (!result) {
    res.status(404).json({ message: "Invite not found" });
    return;
  }

  const { batch, invitee } = result as AcceptInvitationResult;
  await persistInvitationBatch(batch);

  const participantType = invitee.type || "family";

  if (batch.status === "concluded" || batch.status === "expired") {
    res.json({
      inviteBatchId: batch.inviteBatchId,
      roomId: batch.roomId,
      status: batch.status,
      meetingUrl: "",
      inviteeName: invitee.name,
      inviteeType: participantType,
      inviteeRelation: invitee.relation,
      acceptedBy: batch.acceptedBy,
      acceptedAt: batch.acceptedAt,
    });
    return;
  }

  const token = buildJitsiJwt({
    room: batch.roomId,
    userId: String(inviteId),
    name: invitee.name,
    email: invitee.email || "",
    moderator: false,
    affiliation: "member",
    type: participantType,
  });

  const query = new URLSearchParams({
    jwt: token,
    inviteBatchId: batch.inviteBatchId,
    name: invitee.name,
    inviteId: invitee.inviteId,
    moderator: "false",
    participantType,
  });

  const meetingUrl = `${JITSI_DOMAIN}/${batch.roomId}?${query.toString()}`;

  notifyBatchUpdate(batch.inviteBatchId, {
    event: "guest_accepted",
    inviteBatchId: batch.inviteBatchId,
    roomId: batch.roomId,
    status: batch.status,
    acceptedBy: batch.acceptedBy,
    acceptedAt: batch.acceptedAt,
  });

  res.json({
    inviteBatchId: batch.inviteBatchId,
    roomId: batch.roomId,
    status: batch.status,
    meetingUrl,
    inviteeName: invitee.name,
    inviteeType: participantType,
    inviteeRelation: invitee.relation,
    acceptedBy: batch.acceptedBy,
    acceptedAt: batch.acceptedAt,
  });
}
export function getInvitationStatusController(
  req: Request,
  res: Response,
): void {
  const inviteBatchId = req.query.inviteBatchId;

  if (!inviteBatchId || typeof inviteBatchId !== "string") {
    res.status(400).json({ message: "inviteBatchId query param is required" });
    return;
  }

  const batch = getBatchStatus(inviteBatchId);

  if (!batch) {
    res.status(404).json({ message: "Invitation batch not found" });
    return;
  }

  res.json({
    inviteBatchId: batch.inviteBatchId,
    status: batch.status,
    roomId: batch.roomId,
    meetingUrl: batch.meetingUrl,
    acceptedBy: batch.acceptedBy,
    acceptedAt: batch.acceptedAt,
  });
}

export function getInviteDetailsController(req: Request, res: Response): void {
  const inviteId = req.params.inviteId;
  if (typeof inviteId !== "string" || !inviteId) {
    res.status(400).json({ message: "inviteId param is required" });
    return;
  }

  const data = getInviteById(inviteId);
  if (!data) {
    res.status(404).json({ message: "Invite not found" });
    return;
  }

  // Always issue a fresh JWT so the URL is valid when the page loads
  const token = buildJitsiJwt({
    room: data.batch.roomId,
    userId: data.invitee.inviteId,
    name: data.invitee.name,
    email: data.invitee.email || "",
    moderator: false,
    affiliation: "member",
    type: data.invitee.type,
  });
  const query = new URLSearchParams({
    jwt: token,
    inviteBatchId: data.batch.inviteBatchId,
    name: data.invitee.name,
    inviteId: data.invitee.inviteId,
    moderator: "false",
    participantType: data.invitee.type,
  });
  const meetingUrl = `${JITSI_DOMAIN}/${data.batch.roomId}?${query.toString()}`;

  res.json({
    inviteId: data.invitee.inviteId,
    inviteStatus: data.invitee.status,
    inviteeName: data.invitee.name,
    inviteBatchId: data.batch.inviteBatchId,
    meetingUrl,
    batchStatus: data.batch.status,
  });
}

export function sendSmsController(req: Request, res: Response): void {
  const { phone, message, countryCode } = req.body ?? {};
  if (!phone || !message) {
    res.status(400).json({ message: "phone and message are required" });
    return;
  }
  sendSMS(phone, message, countryCode);
  res.json({ message: "SMS sent successfully" });
}

export async function waitingRoomReminderController(
  req: Request,
  res: Response,
): Promise<void> {
  // Only inviteBatchId is required from the client (guest/patient).
  // doctorPhone and waitingStartedAt are resolved server-side from the batch.
  const { inviteBatchId, guestName, countryCode } = req.body ?? {};

  if (!inviteBatchId) {
    res.status(400).json({ message: "inviteBatchId is required" });
    return;
  }

  const batch = getBatchStatus(String(inviteBatchId));
  if (!batch) {
    res.status(404).json({ message: "Invitation batch not found" });
    return;
  }

  try {
    const moderatorToken = buildJitsiJwt({
      room: batch.roomId,
      userId: batch.patientId,
      name: "Doctor",
      email: "",
      moderator: true,
      affiliation: "owner",
      type: "provider",
    });
    const meetingUrl = `${JITSI_DOMAIN}/${batch.roomId}?jwt=${moderatorToken}&moderator=true`;

    const result = await sendWaitingRoomReminder({
      inviteBatchId: String(inviteBatchId),
      meetingUrl,
      ...(countryCode ? { countryCode: String(countryCode) } : {}),
      ...(guestName ? { guestName: String(guestName) } : {}),
    });

    if (!result.sent) {
      res.json({
        sent: false,
        reason: result.reason,
        message:
          result.reason === "doctor_already_joined"
            ? "Doctor has already joined the meeting"
            : "Waiting room reminder was already sent for this session",
      });
      return;
    }

    res.json({
      sent: true,
      message: "Waiting room reminder SMS sent to doctor",
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to send waiting room reminder";
    const status =
      message.includes("3 minutes") || message.includes("not recorded")
        ? 400
        : 500;
    res.status(status).json({ message });
  }
}

export async function nudgeGuestsController(
  req: Request,
  res: Response,
): Promise<void> {
  const { inviteBatchId } = req.body ?? {};

  if (!inviteBatchId) {
    res.status(400).json({ message: "inviteBatchId is required" });
    return;
  }

  try {
    const origin = `${req.protocol}://${req.get("host")}`;
    const { sentCount } = await nudgeGuests(String(inviteBatchId), origin);
    res.json({
      sent: true,
      sentCount,
      message: `Reminder SMS sent to ${sentCount} pending guest(s)`,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to nudge guests";
    res.status(500).json({ message });
  }
}

export async function concludeMeetingController(
  req: Request,
  res: Response,
): Promise<void> {
  const { inviteBatchId } = req.body;

  if (!inviteBatchId) {
    res.status(400).json({
      message: "inviteBatchId is required",
    });
    return;
  }

  const success = await concludeMeeting(String(inviteBatchId));

  if (!success) {
    res.status(404).json({
      message: "Invitation batch not found",
    });
    return;
  }

  const batch = getBatchStatus(inviteBatchId);
  if (batch) await persistInvitationBatch(batch);

  await resetMeetingParticipants(inviteBatchId);
  clearDoctorJoined(inviteBatchId);

  notifyBatchUpdate(inviteBatchId, {
    event: "meeting_concluded",
    inviteBatchId,
    status: "concluded",
  });

  res.json({
    success: true,
    inviteBatchId: String(inviteBatchId),
    status: "concluded",
  });
}

export async function leaveMeetingController(req: Request, res: Response) {
  const { inviteId } = req.body;
  const invite = getInviteById(inviteId);

  if (!invite) {
    res.status(404).json({ message: "Invite not found" });
    return;
  }

  await setInviteeMeetingStatus(inviteId, "Left");

  notifyBatchUpdate(invite.batch.inviteBatchId, {
    event: "participant_left",
    inviteBatchId: invite.batch.inviteBatchId,
    inviteId,
    guestName: invite.invitee.name,
    status: "Left",
  });

  res.json({ success: true });
}
