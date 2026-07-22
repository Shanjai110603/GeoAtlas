import requests
from base_pipeline import BasePipeline
import json

class GeoNamesPipeline(BasePipeline):
    def __init__(self):
        super().__init__(
            source_name="GeoNames",
            attribution="GeoNames geographical database licensed under Creative Commons Attribution 4.0 License.",
            license_type="CC-BY 4.0"
        )
        self.sample_places = [
            {"name": "Chennai", "native_name": "சென்னை", "lat": 13.0827, "lng": 80.2707, "type": "city", "pop": 10971108},
            {"name": "Coimbatore", "native_name": "கோயம்புத்தூர்", "lat": 11.0168, "lng": 76.9558, "type": "city", "pop": 1600000},
            {"name": "Madurai", "native_name": "மதுரை", "lat": 9.9252, "lng": 78.1198, "type": "city", "pop": 1561129},
            {"name": "Tiruchirappalli", "native_name": "திருச்சிராப்பள்ளி", "lat": 10.7905, "lng": 78.7047, "type": "city", "pop": 918000},
            {"name": "Salem", "native_name": "சேலம்", "lat": 11.6643, "lng": 78.1460, "type": "city", "pop": 829267}
        ]

    def process(self, conn) -> tuple[int, int, int, int]:
        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        with conn.cursor() as cur:
            for place in self.sample_places:
                processed += 1
                try:
                    name = place["name"]
                    native_name = place["native_name"]
                    lat = place["lat"]
                    lng = place["lng"]
                    place_type = place["type"]
                    population = place["pop"]

                    attributes = json.dumps({"population": population, "category": place_type})

                    cur.execute(
                        """
                        INSERT INTO entities (entity_type, name, native_name, geom, attributes, confidence_score, source, source_id)
                        VALUES (
                          'place', %s, %s,
                          ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                          %s, 1.00, 'GeoNames', %s
                        )
                        RETURNING id;
                        """,
                        (name, native_name, lng, lat, attributes, f"geonames_{name.lower()}")
                    )
                    inserted += 1
                except Exception as e:
                    self.logger.warning(f"Failed to ingest GeoNames place {place['name']}: {e}")
                    failed += 1

            conn.commit()

        return processed, inserted, updated, failed
