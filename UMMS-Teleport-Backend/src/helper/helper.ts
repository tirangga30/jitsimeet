import jwt from "jsonwebtoken";

type BuildJitsiJwtInput = {
  room: string;
  userId: string;
  name: string;
  email?: string;
  moderator: boolean;
  affiliation: string;
  type?: "provider" | "patient" | "family";
};

export function buildJitsiJwt(input: BuildJitsiJwtInput): string {
  const secret = process.env.JITSI_APP_SECRET;
  if (!secret) throw new Error("JITSI_APP_SECRET is not set");

  const appId = process.env.JITSI_APP_ID;
  if (!appId) throw new Error("JITSI_APP_ID is not set");

  const now = Math.floor(Date.now() / 1000);
  const isModerator = input.moderator ?? false;

  const payload = {
    aud: "jitsi",
    iss: appId, // "bulmartech" — must match prosody app_id
    sub: "meet.bulmartech.com", // your Jitsi domain
    room: input.room, // exact room id, or "*" for any room
    exp: now + 60 * 60 * 24, // 24 hour expiry
    nbf: now - 10,
    iat: now,
    context: {
      user: {
        id: input.userId,
        name: input.name,
        email: input.email ?? "",
        moderator: isModerator,
        // "affiliation" is read by Prosody's token_affiliation module.
        // "owner" grants moderator rights; "member" is a regular participant.
        affiliation: isModerator ? "owner" : "member",
        avatar: "",
        type: input.type,
        participantType: input.type,
      },
      features: {
        livestreaming: false,
        recording: false,
        "screen-sharing": true,
        "outbound-call": false,
      },
    },
  };

  return jwt.sign(payload, secret, { algorithm: "HS256" });
}

export const getCurrentTimeFormatted = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes}${ampm}`;
};
