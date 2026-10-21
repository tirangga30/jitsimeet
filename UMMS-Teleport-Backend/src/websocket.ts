import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import {
  setWaitingStartedAt,
  cancelWaitingRoomReminder,
  setInviteeMeetingStatus,
} from "./services/invitations.service";

const subscribers = new Map<string, Set<WebSocket>>();
const doctorJoinedBatches = new Set<string>(); // remember doctor joined
const guestWaitingBatches = new Map<string, Set<string>>(); // remember guest inviteIds
const PRESENCE_HEARTBEAT_TIMEOUT_MS = 45_000;
const PRESENCE_DISCONNECT_GRACE_MS = 8_000;
const presenceDisconnectTimers = new Map<string, NodeJS.Timeout>();

export function hasDoctorJoined(inviteBatchId: string): boolean {
  return doctorJoinedBatches.has(inviteBatchId);
}

export function clearDoctorJoined(inviteBatchId: string): void {
  doctorJoinedBatches.delete(inviteBatchId);
  guestWaitingBatches.delete(inviteBatchId);
}

export function setupWebSocket(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, `http://localhost`);
    const inviteBatchId = url.searchParams.get("inviteBatchId");
    const presenceInviteId = url.searchParams.get("presenceInviteId");
    let gracefulLeave = false;
    let heartbeatTimeout: NodeJS.Timeout | undefined;

    const clearHeartbeatTimeout = () => {
      if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
      heartbeatTimeout = undefined;
    };

    const refreshPresenceHeartbeat = () => {
      if (!presenceInviteId) return;
      clearHeartbeatTimeout();
      heartbeatTimeout = setTimeout(() => {
        void setInviteeMeetingStatus(presenceInviteId, "Disconnected");
        ws.close(4000, "presence heartbeat timed out");
      }, PRESENCE_HEARTBEAT_TIMEOUT_MS);
    };

    if (!inviteBatchId) {
      ws.close(1008, "inviteBatchId required");
      return;
    }

    if (!subscribers.has(inviteBatchId)) {
      subscribers.set(inviteBatchId, new Set());
    }
    subscribers.get(inviteBatchId)!.add(ws);
    console.log(`WS subscribed: ${inviteBatchId}`);

    if (presenceInviteId) {
      const pendingDisconnect = presenceDisconnectTimers.get(presenceInviteId);
      if (pendingDisconnect) {
        clearTimeout(pendingDisconnect);
        presenceDisconnectTimers.delete(presenceInviteId);
      }
      void setInviteeMeetingStatus(presenceInviteId, "Joined");
      refreshPresenceHeartbeat();
    }

    if (doctorJoinedBatches.has(inviteBatchId)) {
      ws.send(JSON.stringify({ event: "doctor_joined", inviteBatchId }));
    }

    // Handle messages from clients
    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.event === "doctor_joined") {
          console.log(`Doctor joined batch: ${inviteBatchId}`);
          doctorJoinedBatches.add(inviteBatchId);
          cancelWaitingRoomReminder(inviteBatchId);
          
          notifyBatchUpdate(inviteBatchId, {
            event: "doctor_joined",
            inviteBatchId,
          });

        }

        if (data.event === "presence_heartbeat" && presenceInviteId) {
          refreshPresenceHeartbeat();
        }

        if (data.event === "meeting_left" && presenceInviteId) {
          gracefulLeave = true;
          clearHeartbeatTimeout();
          const presence = await setInviteeMeetingStatus(
            presenceInviteId,
            "Left",
          );
          notifyBatchUpdate(inviteBatchId, {
            event: "participant_left",
            inviteBatchId,
            inviteId: presenceInviteId,
            guestName: presence?.invitee.name || "A participant",
            status: "Left",
          });
        }

        // Guest entered waiting room — record server-side timestamp
        if (data.event === "guest_waiting" || data.event === "guest_joined") {
          setWaitingStartedAt(inviteBatchId); // idempotent — only sets once
          if (!guestWaitingBatches.has(inviteBatchId)) {
            guestWaitingBatches.set(inviteBatchId, new Set());
          }
          if (data.inviteId) {
            guestWaitingBatches.get(inviteBatchId)!.add(data.inviteId);
          }

          notifyBatchUpdate(inviteBatchId, {
            event: data.event,
            inviteBatchId,
            guestName: data.guestName,
            inviteId: data.inviteId,
          });

          if (doctorJoinedBatches.has(inviteBatchId)) {
            notifyBatchUpdate(inviteBatchId, {
              event: "doctor_joined",
              inviteBatchId,
            });
          }
        }
      } catch {
        console.error("Invalid WS message");
      }
    });

    ws.on("close", () => {
      clearHeartbeatTimeout();
      if (presenceInviteId && !gracefulLeave) {
        const existingTimer = presenceDisconnectTimers.get(presenceInviteId);
        if (existingTimer) clearTimeout(existingTimer);

        const disconnectTimer = setTimeout(() => {
          presenceDisconnectTimers.delete(presenceInviteId);
          void (async () => {
            const presence = await setInviteeMeetingStatus(
              presenceInviteId,
              "Disconnected",
            );
            notifyBatchUpdate(inviteBatchId, {
              event: "participant_disconnected",
              inviteBatchId,
              inviteId: presenceInviteId,
              guestName: presence?.invitee.name || "A participant",
              status: "Disconnected",
            });
          })();
        }, PRESENCE_DISCONNECT_GRACE_MS);
        presenceDisconnectTimers.set(presenceInviteId, disconnectTimer);
      }
      subscribers.get(inviteBatchId)?.delete(ws);
      if (subscribers.get(inviteBatchId)?.size === 0) {
        subscribers.delete(inviteBatchId);
      }
    });

    ws.on("error", () => ws.close());
  });
}

export function notifyBatchUpdate(inviteBatchId: string, data: object): void {
  const clients = subscribers.get(inviteBatchId);
  if (!clients) return;

  const message = JSON.stringify(data);
  console.log("Notifying:", message);

  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}
