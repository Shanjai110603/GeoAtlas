import sys
import argparse
import os

# Add pipelines directory to Python path for runtime execution
sys.path.append(os.path.join(os.path.dirname(__file__), "pipelines"))

from pipelines.natural_earth import NaturalEarthPipeline
from pipelines.geoboundaries import GeoBoundariesPipeline
from pipelines.geonames import GeoNamesPipeline
from pipelines.osm_pbf import OSMPbfPipeline
from pipelines.osrm_build import OSRMBuildPipeline
from pipelines.wikidata import WikidataPipeline
from pipelines.worldbank import WorldBankPipeline

PIPELINES = {
    "natural_earth": NaturalEarthPipeline,
    "geoboundaries": GeoBoundariesPipeline,
    "geonames": GeoNamesPipeline,
    "osm": OSMPbfPipeline,
    "osrm_build": OSRMBuildPipeline,
    "wikidata": WikidataPipeline,
    "worldbank": WorldBankPipeline
}

def main():
    parser = argparse.ArgumentParser(description="GeoAtlas Ingestion Pipelines CLI")
    parser.add_argument("--source", type=str, choices=list(PIPELINES.keys()) + ["all"], default="all", help="Source pipeline to run")
    args = parser.parse_args()

    if args.source == "all":
        print("Running all GeoAtlas ingestion & OSRM build pipelines sequentially...")
        for name, pipeline_cls in PIPELINES.items():
            print(f"\n================ Running Pipeline: {name} ================")
            p = pipeline_cls()
            p.run()
    else:
        pipeline_cls = PIPELINES[args.source]
        print(f"\nRunning single pipeline: {args.source}")
        p = pipeline_cls()
        p.run()

if __name__ == "__main__":
    main()
