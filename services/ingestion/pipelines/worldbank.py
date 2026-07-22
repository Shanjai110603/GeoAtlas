from base_pipeline import BasePipeline
import json

class WorldBankPipeline(BasePipeline):
    def __init__(self):
        super().__init__(
            source_name="World Bank",
            attribution="World Bank Open Data under Creative Commons Attribution 4.0 International license.",
            license_type="CC-BY 4.0"
        )
        self.sample_indicators = [
            {"country_code": "IN", "gdp_usd": 3385000000000, "population": 1417000000, "literacy_rate": 77.7}
        ]

    def process(self, conn) -> tuple[int, int, int, int]:
        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        with conn.cursor() as cur:
            for ind in self.sample_indicators:
                processed += 1
                try:
                    code = ind["country_code"]
                    gdp = ind["gdp_usd"]
                    pop = ind["population"]
                    lit = ind["literacy_rate"]

                    indicators = json.dumps({"gdp_usd": gdp, "population": pop, "literacy_rate": lit})

                    cur.execute(
                        """
                        UPDATE admin_levels
                        SET updated_at = NOW()
                        WHERE country_code = %s AND level_number = 0;
                        """,
                        (code,)
                    )
                    updated += 1
                except Exception as e:
                    self.logger.warning(f"Failed World Bank indicators update for {ind['country_code']}: {e}")
                    failed += 1

            conn.commit()

        return processed, inserted, updated, failed
