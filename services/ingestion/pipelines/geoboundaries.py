import requests
import json
from base_pipeline import BasePipeline

class GeoBoundariesPipeline(BasePipeline):
    def __init__(self, country_code="IND", admin_level="ADM1"):
        super().__init__(
            source_name=f"geoBoundaries-{country_code}-{admin_level}",
            attribution="geoBoundaries API / Runfola et al. (2020) geoBoundaries: A global database of political administrative boundaries.",
            license_type="CC-BY 4.0"
        )
        self.country_code = country_code
        self.admin_level = admin_level

    def process(self, conn) -> tuple[int, int, int, int]:
        self.logger.info(f"Fetching geoBoundaries metadata for {self.country_code} ({self.admin_level})...")
        meta_url = f"https://www.geoboundaries.org/api/current/gbOpen/{self.country_code}/{self.admin_level}/"
        res = requests.get(meta_url, timeout=30)
        res.raise_for_status()
        meta = res.json()

        download_url = meta.get("gjDownloadURL")
        if not download_url:
            raise ValueError(f"No GeoJSON download URL found in geoBoundaries response for {self.country_code}")

        self.logger.info(f"Downloading boundaries GeoJSON from {download_url}...")
        geojson_res = requests.get(download_url, timeout=60)
        geojson_res.raise_for_status()
        data = geojson_res.json()

        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        with conn.cursor() as cur:
            # Find parent ID (e.g. India ADM0)
            cur.execute("SELECT id FROM admin_levels WHERE country_code = 'IN' AND level_number = 0 LIMIT 1;")
            parent_row = cur.fetchone()
            parent_id = parent_row['id'] if parent_row else None

            for feature in data.get("features", []):
                processed += 1
                try:
                    props = feature.get("properties", {})
                    geom = feature.get("geometry", {})
                    name = props.get("shapeName", props.get("shapeISO", "Unknown Admin Region"))
                    geom_json = json.dumps(geom)
                    level_num = 1 if self.admin_level == "ADM1" else 2

                    cur.execute(
                        """
                        INSERT INTO admin_levels (country_code, level_number, local_term, parent_id, name, geom, centroid, source)
                        VALUES (
                          'IN', %s, %s, %s, %s,
                          ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326)),
                          ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326)),
                          'geoBoundaries'
                        )
                        RETURNING id;
                        """,
                        (level_num, self.admin_level, parent_id, name, geom_json, geom_json)
                    )
                    inserted += 1
                except Exception as e:
                    self.logger.warning(f"Failed to insert geoBoundaries region {name}: {e}")
                    failed += 1

            conn.commit()

        return processed, inserted, updated, failed
