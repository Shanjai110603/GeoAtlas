from base_pipeline import BasePipeline
import json

class WikidataPipeline(BasePipeline):
    def __init__(self):
        super().__init__(
            source_name="Wikidata",
            attribution="Wikidata content released under Creative Commons CC0 License.",
            license_type="CC0 1.0"
        )
        self.sample_links = [
            {"entity_name": "Apollo Hospitals Greams Road", "wikidata_id": "Q4780313"},
            {"entity_name": "Madras Christian College Higher Secondary School", "wikidata_id": "Q6728472"},
            {"entity_name": "Chennai", "wikidata_id": "Q1352"}
        ]

    def process(self, conn) -> tuple[int, int, int, int]:
        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        with conn.cursor() as cur:
            for item in self.sample_links:
                processed += 1
                try:
                    name = item["entity_name"]
                    qid = item["wikidata_id"]

                    cur.execute(
                        """
                        UPDATE entities
                        SET attributes = jsonb_set(attributes, '{wikidata_id}', %s::jsonb),
                            updated_at = NOW()
                        WHERE name = %s;
                        """,
                        (json.dumps(qid), name)
                    )
                    updated += 1
                except Exception as e:
                    self.logger.warning(f"Failed to link Wikidata ID for {item['entity_name']}: {e}")
                    failed += 1

            conn.commit()

        return processed, inserted, updated, failed
