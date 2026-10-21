-- Optional fields preserve existing provider records while supporting the
-- UMMS participant directory shown in the provider-selection modal.
ALTER TABLE "ProviderAndStaff"
  ADD COLUMN "department" TEXT,
  ADD COLUMN "providerType" TEXT,
  ADD COLUMN "location" TEXT;
