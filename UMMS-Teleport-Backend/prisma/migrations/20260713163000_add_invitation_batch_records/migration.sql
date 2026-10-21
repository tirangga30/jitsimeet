CREATE TABLE "InvitationBatchRecord" (
  "inviteBatchId" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "meetingUrl" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "invitedAt" TIMESTAMP(3) NOT NULL,
  "acceptedBy" TEXT,
  "acceptedAt" TIMESTAMP(3),
  "waitingStartedAt" TIMESTAMP(3),
  "doctorPhone" TEXT,
  "invitees" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InvitationBatchRecord_pkey" PRIMARY KEY ("inviteBatchId")
);

CREATE INDEX "InvitationBatchRecord_patientId_status_idx"
  ON "InvitationBatchRecord"("patientId", "status");
