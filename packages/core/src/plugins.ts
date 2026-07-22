export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'data_connector' | 'map_style' | 'analytics' | 'export_format';
  installed: boolean;
  enabled: boolean;
}

export interface EtlPipelineJob {
  id: string;
  name: string;
  sourceDataset: string;
  frequency: 'Hourly' | 'Daily' | 'Weekly';
  lastRunStatus: 'SUCCESS' | 'RUNNING' | 'FAILED';
  lastRunTime: string;
  recordsProcessed: number;
}

export const SAMPLE_PLUGINS: PluginManifest[] = [
  {
    id: 'osm_pbf_extractor',
    name: 'OpenStreetMap Custom PBF Extractor',
    version: '2.1.0',
    author: 'GeoAtlas Core Team',
    description: 'High-speed vector feature extractor for OSM protocol buffer files',
    category: 'data_connector',
    installed: true,
    enabled: true,
  },
  {
    id: 'census_csv_importer',
    name: 'Global Census Data Importer',
    version: '1.4.2',
    author: 'OpenGIS Community',
    description: 'Automated CSV/Parquet demographic dataset parser with PostGIS spatial join',
    category: 'data_connector',
    installed: true,
    enabled: true,
  },
  {
    id: 'deckgl_3d_buildings',
    name: 'deck.gl 3D Extruded Buildings Layer',
    version: '3.0.1',
    author: 'Uber H3 & deck.gl',
    description: 'Hardware-accelerated WebGL 3D building height extrusion rendering engine',
    category: 'map_style',
    installed: false,
    enabled: false,
  },
];

export const SAMPLE_ETL_PIPELINES: EtlPipelineJob[] = [
  {
    id: 'etl_1',
    name: 'geoBoundaries ADM0 & ADM1 Daily Sync',
    sourceDataset: 'geoBoundaries Release v6.0',
    frequency: 'Daily',
    lastRunStatus: 'SUCCESS',
    lastRunTime: '3 hours ago',
    recordsProcessed: 195,
  },
  {
    id: 'etl_2',
    name: 'USGS Real-Time Earthquake Stream',
    sourceDataset: 'earthquake.usgs.gov GeoJSON',
    frequency: 'Hourly',
    lastRunStatus: 'SUCCESS',
    lastRunTime: '12 mins ago',
    recordsProcessed: 48,
  },
];
