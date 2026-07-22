import os
import psycopg2
from psycopg2.extras import RealDictCursor

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_USER = os.getenv("POSTGRES_USER", "geoatlas")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "geoatlas_secret")
DB_NAME = os.getenv("POSTGRES_DB", "geoatlas")

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        dbname=DB_NAME,
        cursor_factory=RealDictCursor
    )

def log_pipeline_start(conn, source_name):
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO pipeline_runs (source, status)
            VALUES (%s, 'running')
            RETURNING id;
            """,
            (source_name,)
        )
        run_id = cur.fetchone()['id']
        conn.commit()
        return run_id

def log_pipeline_finish(conn, run_id, records_processed, inserted, updated, failed, status='completed', error_msg=None):
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE pipeline_runs
            SET records_processed = %s,
                records_inserted = %s,
                records_updated = %s,
                records_failed = %s,
                status = %s,
                error_message = %s,
                completed_at = NOW()
            WHERE id = %s;
            """,
            (records_processed, inserted, updated, failed, status, error_msg, run_id)
        )
        conn.commit()
