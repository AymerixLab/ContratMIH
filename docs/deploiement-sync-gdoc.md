## Pré-requis

- Accès au projet Google Cloud avec activation des API Sheets et Drive.
- Compte de service Google avec fichier JSON téléchargé et partagé en édition sur le classeur cible.
- Docker et Docker Compose installés.
- Variables d'environnement nécessaires prêtes (voir ci-dessous).

### Récupération du JSON et activation des API

1. Se connecter à la console Google Cloud et créer (ou sélectionner) un projet.
2. Dans "Bibliothèque d'API", activer **Google Sheets API** et **Google Drive API**.
3. Aller dans "Identifiants" → "Créer des identifiants" → **Compte de service**.
4. Une fois le compte créé, ouvrir l'onglet "Clés", cliquer sur **Ajouter une clé** → **Créer une clé JSON** puis télécharger le fichier (`service-account.json`).
5. Partager le classeur Google Sheets cible avec l'adresse e-mail du compte de service (droits Éditeur).

## Configuration des secrets

1. Encoder le JSON du compte de service en Base64 :
   ```bash
   base64 -i service-account.json -o service-account.json.b64
   ```
2. Créer un fichier `.env.db-sync` (non versionné) à la racine du projet et y définir :
   ```bash
   DB_SYNC_DATABASE_URL=postgresql://mih:mih_password@db:5432/mih_staging
   DB_SYNC_CRON=*/5 * * * *
   GOOGLE_SPREADSHEET_ID=<ID_DU_CLASSEUR>
   GOOGLE_CREDENTIALS_BASE64=$(cat service-account.json.b64)
   DB_SYNC_EXCLUDED_SCHEMAS=prisma
   DB_SYNC_EXCLUDED_TABLE_PREFIXES=prisma
   DB_SYNC_TIMEZONE=Europe/Paris
   ```

## Build & démarrage du conteneur

1. Vérifier le `docker-compose.yml` : le service `db-sync` doit dépendre de `db` et référencer `Dockerfile.db-sync`.
2. Construire l'image :
   ```bash
   docker compose build db-sync
   ```
3. Lancer la synchronisation planifiée :
   ```bash
   docker compose up -d db-sync
   ```

## Exécution ponctuelle

Pour forcer une synchronisation immédiatement :
```bash
docker compose run --rm --env-file .env.db-sync db-sync python /app/sync.py --once
```

## Vérifications

- Consulter les logs :
  ```bash
  docker compose logs -f db-sync
  ```
- Contrôler que chaque table Postgres apparaît dans une feuille du classeur.
- Surveiller les quotas API Google Sheets/Drive en cas d'usage intensif.
