# Plan d’implémentation : synchronisation Postgres → Google Sheets

## Objectif
Mettre en place un service Python conteneurisé qui synchronise toutes les tables Postgres (sauf celles liées à Prisma) vers un classeur Google Sheets : une feuille par table, mise à jour automatique toutes les 5 minutes, avec possibilité d’exécution manuelle.

## Architecture & Fichiers
1. Créer un dossier `scripts/db-sync/` contenant :
   - `sync.py` : script principal (lecture des tables, filtrage Prisma, export vers Sheets, option `--once`).
   - `requirements.txt` : dépendances Python (`psycopg[binary]`, `gspread`, `google-auth`, `pandas`, `tenacity`).
   - `entrypoint.sh` :
     - Décoder `GOOGLE_CREDENTIALS_BASE64` vers `/tmp/creds.json`.
     - Générer un fichier cron à partir de `DB_SYNC_CRON` (par défaut `*/5 * * * *`).
     - Lancer `supercronic` (ou `crond`) pour exécuter `sync.py` périodiquement.
     - Permettre l’exécution unique via l’argument `--once`.
2. Ajouter `Dockerfile.db-sync` basé sur `python:3.11-slim` :
   - Installation des dépendances système (`build-essential`, `libpq-dev`).
   - `pip install -r requirements.txt`.
   - Installation de `supercronic`, copie des scripts, définition de `ENTRYPOINT`/`CMD`.

## Intégration Docker Compose
- Ajouter un service `db-sync` dans `docker-compose.yml` :
  - `build` → `Dockerfile.db-sync`.
  - `depends_on`: `db`.
  - Variables d’environnement via `.env.db-sync` (non commité) :
    - `DB_SYNC_DATABASE_URL=postgresql://mih:mih_password@db:5432/mih_staging`
    - `DB_SYNC_CRON=*/5 * * * *`
    - `GOOGLE_SPREADSHEET_ID=<ID du classeur>`
    - `GOOGLE_CREDENTIALS_BASE64=<JSON service account encodé>`
    - `DB_SYNC_EXCLUDED_SCHEMAS=prisma`
    - `DB_SYNC_EXCLUDED_TABLE_PREFIXES=prisma`
    - `DB_SYNC_TIMEZONE=Europe/Paris`
    - (optionnel) `DB_SYNC_BATCH_SIZE`, `DB_SYNC_LOG_LEVEL`
  - Prévoir un volume temporaire pour le fichier credentials si nécessaire.
  - Commande par défaut : `supercronic /app/cronfile`. Pour exécution manuelle : `docker compose run --rm db-sync python /app/sync.py --once`.

## Fonctionnement du script `sync.py`
1. Charger la configuration via les variables d’environnement.
2. Filtrer la liste des tables depuis `information_schema` en excluant `prisma` (schéma ou préfixe).
3. Pour chaque table :
   - Lire les données via `psycopg` (possibilité de pagination avec `DB_SYNC_BATCH_SIZE`).
   - Créer ou vider la feuille correspondante (nom = nom de table).
   - Écrire les en-têtes et les lignes via `gspread`/`pandas` (`worksheet.update`).
4. Gérer les logs et réessais (`tenacity`).

## Pré-requis Google
- Créer un projet Google Cloud, activer les APIs Sheets et Drive.
- Générer un compte de service, télécharger le JSON, l’encoder en base64 pour `GOOGLE_CREDENTIALS_BASE64`.
- Partager le classeur avec l’adresse du service account (droits éditeur).
- Confirmer l’ID du classeur (portion entre `/d/` et `/edit`).

## Tests & Validation
- Test manuel : `docker compose run --rm db-sync python /app/sync.py --once` puis vérifier la mise à jour du classeur.
- Suivre les logs (`docker compose logs db-sync`) pour confirmer l’exécution toutes les 5 minutes.
- Monitorer les quotas API (adaptés pour <500 lignes, extensibles via Google Cloud si besoin).

## Livraison
- Fichiers concernés : `plan.md`, `scripts/db-sync/**`, `Dockerfile.db-sync`, `docker-compose.yml` (ajout service), scripts npm éventuels pour lancer la synchro manuelle.
