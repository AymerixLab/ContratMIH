import argparse
import base64
import json
import logging
import os
from dataclasses import dataclass
from decimal import Decimal
from typing import Iterable, List, Sequence, Tuple

import gspread
import pandas as pd
import psycopg
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from psycopg import sql
from psycopg.rows import dict_row
from tenacity import RetryError, retry, retry_if_exception_type, stop_after_attempt, wait_exponential


load_dotenv()


SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def _parse_csv(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass
class Config:
    database_url: str
    spreadsheet_id: str
    included_schemas: List[str]
    excluded_schemas: List[str]
    excluded_table_prefixes: List[str]
    sheet_name_prefix: str
    batch_size: int | None
    log_level: str

    @classmethod
    def from_env(cls) -> "Config":
        database_url = os.getenv("DB_SYNC_DATABASE_URL")
        spreadsheet_id = os.getenv("GOOGLE_SPREADSHEET_ID")
        if not database_url:
            raise ValueError("DB_SYNC_DATABASE_URL must be set")
        if not spreadsheet_id:
            raise ValueError("GOOGLE_SPREADSHEET_ID must be set")

        included_schemas = _parse_csv(os.getenv("DB_SYNC_INCLUDED_SCHEMAS"))
        if not included_schemas:
            included_schemas = ["public"]
        excluded_schemas = _parse_csv(os.getenv("DB_SYNC_EXCLUDED_SCHEMAS"))
        excluded_table_prefixes = _parse_csv(os.getenv("DB_SYNC_EXCLUDED_TABLE_PREFIXES"))
        sheet_name_prefix = os.getenv("DB_SYNC_SHEET_PREFIX", "")

        batch_size_value = os.getenv("DB_SYNC_BATCH_SIZE")
        batch_size: int | None
        if batch_size_value:
            batch_size = int(batch_size_value)
        else:
            batch_size = None

        log_level = os.getenv("DB_SYNC_LOG_LEVEL", "INFO").upper()

        return cls(
            database_url=database_url,
            spreadsheet_id=spreadsheet_id,
            included_schemas=included_schemas,
            excluded_schemas=excluded_schemas,
            excluded_table_prefixes=excluded_table_prefixes,
            sheet_name_prefix=sheet_name_prefix,
            batch_size=batch_size,
            log_level=log_level,
        )


def _build_credentials() -> Credentials:
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if credentials_path and os.path.exists(credentials_path):
        return Credentials.from_service_account_file(credentials_path, scopes=SCOPES)

    credentials_base64 = os.getenv("GOOGLE_CREDENTIALS_BASE64")
    if not credentials_base64:
        raise ValueError(
            "Provide GOOGLE_APPLICATION_CREDENTIALS path or GOOGLE_CREDENTIALS_BASE64 contents"
        )

    decoded = base64.b64decode(credentials_base64)
    info = json.loads(decoded)
    return Credentials.from_service_account_info(info, scopes=SCOPES)


def _should_skip_table(table_name: str, prefixes: Sequence[str]) -> bool:
    return any(table_name.startswith(prefix) for prefix in prefixes)


def _discover_tables(
    conn: psycopg.Connection,
    included_schemas: Sequence[str],
    excluded_schemas: Sequence[str],
    excluded_prefixes: Sequence[str],
) -> List[Tuple[str, str]]:
    query = [
        "SELECT table_schema, table_name",
        "FROM information_schema.tables",
        "WHERE table_type = 'BASE TABLE'",
    ]
    params: List[Sequence[str]] = []

    if included_schemas:
        query.append("AND table_schema = ANY(%s)")
        params.append(included_schemas)

    if excluded_schemas:
        query.append("AND NOT (table_schema = ANY(%s))")
        params.append(excluded_schemas)

    query.append("ORDER BY table_schema, table_name")
    sql_query = "\n" + "\n".join(query)

    with conn.cursor() as cur:
        cur.execute(sql_query, params if params else None)
        rows = cur.fetchall()

    results: List[Tuple[str, str]] = []
    for schema_name, table_name in rows:
        if _should_skip_table(table_name, excluded_prefixes):
            continue
        results.append((schema_name, table_name))
    return results


def _worksheet_title(prefix: str, schema: str, table: str, default_schema: str) -> str:
    base = table if schema == default_schema else f"{schema}.{table}"
    return f"{prefix}{base}" if prefix else base


def _fetch_table_data(
    conn: psycopg.Connection, schema: str, table: str, batch_size: int | None
) -> Tuple[List[str], List[List[object]]]:
    statement = sql.SQL("SELECT * FROM {}.{}").format(
        sql.Identifier(schema), sql.Identifier(table)
    )

    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(statement)
        columns = [desc[0] for desc in cur.description]
        if batch_size:
            rows: List[List[object]] = []
            while True:
                chunk = cur.fetchmany(batch_size)
                if not chunk:
                    break
                rows.extend(_normalize_rows(chunk, columns))
        else:
            data = cur.fetchall()
            rows = _normalize_rows(data, columns)

    return columns, rows


def _normalize_rows(records: Iterable[dict], columns: Sequence[str]) -> List[List[object]]:
    normalized: List[List[object]] = []
    for record in records:
        row = []
        for column in columns:
            value = record.get(column)
            if value is None:
                row.append("")
            elif isinstance(value, Decimal):
                row.append(str(value))
            elif isinstance(value, (list, dict)):
                row.append(json.dumps(value, default=str))
            elif pd.isna(value):
                row.append("")
            else:
                row.append(value)
        normalized.append(row)
    return normalized


def _ensure_worksheet(spreadsheet: gspread.Spreadsheet, title: str) -> gspread.Worksheet:
    try:
        worksheet = spreadsheet.worksheet(title)
        worksheet.clear()
        return worksheet
    except gspread.exceptions.WorksheetNotFound:
        return spreadsheet.add_worksheet(title=title, rows=1, cols=1)


@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=30),
    retry=retry_if_exception_type(
        (gspread.exceptions.APIError, psycopg.Error, ConnectionError)
    ),
)
def _sync_table(
    conn: psycopg.Connection,
    spreadsheet: gspread.Spreadsheet,
    schema: str,
    table: str,
    config: Config,
) -> None:
    columns, rows = _fetch_table_data(conn, schema, table, config.batch_size)
    title = _worksheet_title(config.sheet_name_prefix, schema, table, config.included_schemas[0])
    worksheet = _ensure_worksheet(spreadsheet, title)
    values: List[List[object]] = [list(columns)]
    values.extend(rows)
    worksheet.update("A1", values)


def main() -> int:
    parser = argparse.ArgumentParser(description="Synchronise Postgres tables vers Google Sheets")
    parser.add_argument("--once", action="store_true", help="Exécuter une synchronisation unique")
    parser.add_argument(
        "--tables",
        nargs="*",
        help="Limiter la synchronisation à certaines tables (schema.table)",
    )
    args = parser.parse_args()

    config = Config.from_env()
    logging.basicConfig(
        level=getattr(logging, config.log_level, logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )
    logger = logging.getLogger("db_sync")

    if args.once:
        logger.info("Exécution unique déclenchée")

    try:
        credentials = _build_credentials()
    except Exception as exc:
        logger.error("Impossible de charger les credentials Google: %s", exc)
        raise

    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(config.spreadsheet_id)

    tables_filter: set[str] | None = None
    if args.tables:
        tables_filter = {table.lower() for table in args.tables}

    try:
        with psycopg.connect(config.database_url, autocommit=True) as conn:
            tables = _discover_tables(
                conn,
                config.included_schemas,
                config.excluded_schemas,
                config.excluded_table_prefixes,
            )

            if tables_filter:
                tables = [
                    (schema, table)
                    for schema, table in tables
                    if f"{schema}.{table}" in tables_filter
                ]

            for schema, table in tables:
                logger.info("Synchronisation de %s.%s", schema, table)
                try:
                    _sync_table(conn, spreadsheet, schema, table, config)
                    logger.info("Synchronisation terminée pour %s.%s", schema, table)
                except RetryError as retry_error:
                    logger.error(
                        "Échec après plusieurs tentatives pour %s.%s: %s",
                        schema,
                        table,
                        retry_error,
                    )
                except Exception:
                    logger.exception("Erreur pendant la synchronisation de %s.%s", schema, table)
                    raise
    except Exception as exc:
        logger.exception("Synchronisation interrompue: %s", exc)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
