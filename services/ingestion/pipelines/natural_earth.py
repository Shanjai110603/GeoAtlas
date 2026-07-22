import requests
import json
from base_pipeline import BasePipeline

class NaturalEarthPipeline(BasePipeline):
    def __init__(self):
        super().__init__(
            source_name="Natural Earth",
            attribution="Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com.",
            license_type="Public Domain"
        )
        self.geojson_url = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"

    def process(self, conn) -> tuple[int, int, int, int]:
        self.logger.info("Downloading Natural Earth country boundaries GeoJSON...")
        res = requests.get(self.geojson_url, timeout=30)
        res.raise_for_status()
        data = res.json()

        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        with conn.cursor() as cur:
            for feature in data.get("features", []):
                processed += 1
                try:
                    props = feature.get("properties", {})
                    geom = feature.get("geometry", {})
                    country_code = props.get("ISO_A2", props.get("ADM0_A3", "XX")[:2]).upper()
                    name = props.get("NAME", "Unknown Country")
                    native_name = props.get("NAME_LONG")

                    geom_json = json.dumps(geom)

                    cur.execute(
                        """
                        INSERT INTO admin_levels (country_code, level_number, local_term, name, native_name, geom, centroid, source)
                        VALUES (
                          %s, 0, 'Country', %s, %s,
                          ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326)),
                          ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326)),
                          'Natural Earth'
                        )
                        ON CONFLICT (id) DO UPDATE SET
                          name = EXCLUDED.name,
                          updated_at = NOW()
                        RETURNING id;
                        """,
                        (country_code, name, native_name, geom_json, geom_json)
                    )
                    inserted += 1
                except Exception as e:
                    self.logger.warning(f"Failed to process feature {name}: {e}")
                    failed += 1

            conn.commit()

        return processed, inserted, updated, failed
