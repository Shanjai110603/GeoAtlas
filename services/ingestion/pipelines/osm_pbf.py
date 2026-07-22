import json
import os
from base_pipeline import BasePipeline

class OSMPbfPipeline(BasePipeline):
    def __init__(self, region="Tamil Nadu"):
        super().__init__(
            source_name=f"OpenStreetMap-{region}",
            attribution="© OpenStreetMap contributors. Data available under the Open Database License (ODbL).",
            license_type="ODbL 1.0"
        )
        self.region = region
        self.sample_entities = [
            {
                "osm_id": "way/1029384",
                "type": "hospital",
                "name": "Apollo Hospitals Greams Road",
                "native_name": "அப்பல்லோ மருத்துவமனை",
                "lat": 13.0607,
                "lng": 80.2512,
                "attributes": {
                    "amenity": "hospital",
                    "emergency": "yes",
                    "healthcare": "hospital",
                    "website": "https://www.apollohospitals.com",
                    "phone": "+91 44 2829 0200"
                }
            },
            {
                "osm_id": "node/2039481",
                "type": "school",
                "name": "Madras Christian College Higher Secondary School",
                "native_name": "எம்.சி.சி மேல்நிலைப் பள்ளி",
                "lat": 13.0694,
                "lng": 80.2435,
                "attributes": {
                    "amenity": "school",
                    "operator": "MCC Trust",
                    "fee": "yes"
                }
            },
            {
                "osm_id": "node/3049582",
                "type": "business",
                "name": "Saravana Bhavan T.Nagar",
                "native_name": "சரவண பவன்",
                "lat": 13.0418,
                "lng": 80.2341,
                "attributes": {
                    "amenity": "restaurant",
                    "cuisine": "south_indian",
                    "opening_hours": "06:00-22:30",
                    "website": "https://www.saravanabhavan.com"
                }
            },
            {
                "osm_id": "way/4059683",
                "type": "road",
                "name": "Anna Salai (Mount Road)",
                "native_name": "அண்ணா சாலை",
                "lat": 13.0583,
                "lng": 80.2580,
                "attributes": {
                    "highway": "primary",
                    "lanes": "6",
                    "maxspeed": "60"
                }
            }
        ]

    def process(self, conn) -> tuple[int, int, int, int]:
        processed = 0
        inserted = 0
        updated = 0
        failed = 0

        with conn.cursor() as cur:
            for item in self.sample_entities:
                processed += 1
                try:
                    osm_id = item["osm_id"]
                    entity_type = item["type"]
                    name = item["name"]
                    native_name = item["native_name"]
                    lat = item["lat"]
                    lng = item["lng"]

                    attributes = item["attributes"]
                    attributes["attribution"] = self.attribution
                    attributes_json = json.dumps(attributes)

                    cur.execute(
                        """
                        INSERT INTO entities (entity_type, name, native_name, geom, attributes, confidence_score, source, source_id)
                        VALUES (
                          %s, %s, %s,
                          ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                          %s, 1.00, 'OpenStreetMap', %s
                        )
                        RETURNING id;
                        """,
                        (entity_type, name, native_name, lng, lat, attributes_json, osm_id)
                    )
                    inserted += 1
                except Exception as e:
                    self.logger.warning(f"Failed to ingest OSM item {item['name']}: {e}")
                    failed += 1

            conn.commit()

        return processed, inserted, updated, failed
