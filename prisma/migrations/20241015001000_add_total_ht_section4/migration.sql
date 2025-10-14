-- Add total_ht_section4 column if missing
ALTER TABLE "submissions"
  ADD COLUMN IF NOT EXISTS "total_ht_section4" DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- Optional: remove default to match Prisma schema (requires Postgres 11+)
ALTER TABLE "submissions"
  ALTER COLUMN "total_ht_section4" DROP DEFAULT;
