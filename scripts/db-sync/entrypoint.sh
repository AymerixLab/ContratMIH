#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/app"
CRON_FILE="$APP_DIR/cronfile"
CREDENTIALS_PATH="/tmp/google-credentials.json"

mkdir -p /var/log

if [[ -n "${GOOGLE_CREDENTIALS_BASE64:-}" ]]; then
  echo "$GOOGLE_CREDENTIALS_BASE64" | base64 --decode > "$CREDENTIALS_PATH"
  chmod 600 "$CREDENTIALS_PATH"
  export GOOGLE_APPLICATION_CREDENTIALS="$CREDENTIALS_PATH"
fi

TZ_VALUE="${DB_SYNC_TIMEZONE:-UTC}"
if [[ -f "/usr/share/zoneinfo/$TZ_VALUE" ]]; then
  ln -sf "/usr/share/zoneinfo/$TZ_VALUE" /etc/localtime
  echo "$TZ_VALUE" > /etc/timezone
fi
export TZ="$TZ_VALUE"

CRON_EXPR="${DB_SYNC_CRON:-*/5 * * * *}"

cat <<EOF > "$CRON_FILE"
SHELL=/bin/sh
TZ=$TZ_VALUE
$CRON_EXPR cd $APP_DIR && python sync.py >> /var/log/db-sync.log 2>&1
EOF

chmod 600 "$CRON_FILE"

if [[ $# -gt 0 ]]; then
  exec "$@"
fi

exec supercronic "$CRON_FILE"
