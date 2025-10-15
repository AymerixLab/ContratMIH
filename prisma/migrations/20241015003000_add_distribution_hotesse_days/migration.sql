-- Track distribution hôtesse day selections and day count
ALTER TABLE "submissions"
  ADD COLUMN IF NOT EXISTS "distribution_hotesse_days" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "distribution_hotesse_day" INTEGER;
