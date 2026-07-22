from abc import ABC, abstractmethod
import logging
from db import get_db_connection, log_pipeline_start, log_pipeline_finish

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

class BasePipeline(ABC):
    def __init__(self, source_name: str, attribution: str, license_type: str):
        self.source_name = source_name
        self.attribution = attribution
        self.license_type = license_type
        self.logger = logging.getLogger(source_name)

    def run(self):
        self.logger.info(f"Starting ingestion pipeline for {self.source_name}")
        self.logger.info(f"Licensing & Attribution: {self.attribution} ({self.license_type})")

        conn = get_db_connection()
        run_id = log_pipeline_start(conn, self.source_name)

        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        try:
            processed, inserted, updated, failed = self.process(conn)
            log_pipeline_finish(conn, run_id, processed, inserted, updated, failed, status="completed")
            self.logger.info(f"Finished {self.source_name} pipeline. Processed: {processed}, Inserted: {inserted}, Updated: {updated}, Failed: {failed}")
        except Exception as e:
            self.logger.error(f"Pipeline {self.source_name} failed: {str(e)}", exc_info=True)
            log_pipeline_finish(conn, run_id, processed, inserted, updated, failed, status="failed", error_msg=str(e))
            raise e
        finally:
            conn.close()

    @abstractmethod
    def process(self, conn) -> tuple[int, int, int, int]:
        """
        Executes the main extraction, transformation, and database loading.
        Returns tuple: (processed_count, inserted_count, updated_count, failed_count)
        """
        pass
