-- Add rail_spots column for rail de 3 spots option
ALTER TABLE "submissions"
  ADD COLUMN IF NOT EXISTS "rail_spots" INTEGER NOT NULL DEFAULT 0;

-- Remove default to align with Prisma schema (optional)
ALTER TABLE "submissions"
  ALTER COLUMN "rail_spots" DROP DEFAULT;
