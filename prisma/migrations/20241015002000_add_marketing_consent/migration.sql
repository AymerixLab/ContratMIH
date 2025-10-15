-- Add marketing consent opt-in flag
ALTER TABLE "submissions"
  ADD COLUMN IF NOT EXISTS "accepte_communication" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "submissions"
  ALTER COLUMN "accepte_communication" DROP DEFAULT;
