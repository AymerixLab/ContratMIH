-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "submission_id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documents_submission_id_idx" ON "documents"("submission_id");

-- AddForeignKey
ALTER TABLE "documents"
  ADD CONSTRAINT "documents_submission_id_fkey"
  FOREIGN KEY ("submission_id") REFERENCES "submissions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
