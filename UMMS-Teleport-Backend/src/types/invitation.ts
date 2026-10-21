export type InvitationStatus = "sent" | "accepted" | "expired";
export type InviteeContactType = "provider" | "patient" | "family";
export type MeetingParticipantType = "provider" | "patient" | "guest";

export interface Invitee {
  id: string;
  inviteId: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  status: string;
  acceptedAt?: string;
  /** Database/contact category. Family and friends are exposed as guests in API responses. */
  type: InviteeContactType;
  invite?: boolean;
}

export interface MeetingParticipant {
  id: string;
  type: MeetingParticipantType;
  name?: string;
  phone?: string;
  email?: string;
  relation?: string;
  status?: string;
  inviteId?: string;
}

export interface InvitationBatch {
  inviteBatchId: string;
  patientId: string;
  roomId: string;
  meetingUrl: string;
  status: "waiting" | "accepted" | "expired" | "concluded";
  invitedAt: string;
  acceptedBy?: string; // inviteId
  acceptedAt?: string;
  waitingStartedAt?: string; // set server-side when first guest enters waiting room
  doctorPhone?: string; // stored at batch-creation time, used for reminder SMS
  invitees: Invitee[];
}
export interface AcceptInvitationResult {
  batch: InvitationBatch;
  invitee: Invitee;
}
