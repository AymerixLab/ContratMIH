-- Migration pour ajouter les colonnes JSONB de backup
-- Ces colonnes garantissent qu'aucune donnée ne sera jamais perdue

ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS raw_payload JSONB,
ADD COLUMN IF NOT EXISTS raw_totals JSONB;

-- Indexer les colonnes JSONB pour performance
CREATE INDEX IF NOT EXISTS idx_submissions_raw_payload ON submissions USING GIN (raw_payload);
CREATE INDEX IF NOT EXISTS idx_submissions_raw_totals ON submissions USING GIN (raw_totals);

COMMENT ON COLUMN submissions.raw_payload IS 'Backup complet de toutes les données du formulaire au format JSON';
COMMENT ON COLUMN submissions.raw_totals IS 'Backup des totaux calculés au format JSON';
