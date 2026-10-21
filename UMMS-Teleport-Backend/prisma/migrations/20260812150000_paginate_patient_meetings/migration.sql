-- Prevent the same meeting room from being recorded more than once.
CREATE UNIQUE INDEX "Meeting_roomId_key" ON "Meeting"("roomId");

-- Support newest-first meeting history lookups for a patient.
CREATE INDEX "Meeting_patientId_createdAt_id_idx"
ON "Meeting"("patientId", "createdAt" DESC, "id" DESC);
