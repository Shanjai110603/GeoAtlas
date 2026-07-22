export interface EnvironmentalLayerConfig {
  id: string;
  name: string;
  type: 'raster' | 'geojson';
  enabled: boolean;
  opacity: number;
  tileUrl?: string;
}

export interface SeismicAlert {
  id: string;
  title: string;
  magnitude: number;
  location: string;
  depthKm: number;
  coordinates: [number, number]; // [lng, lat]
  time: string;
}

export const WEATHER_RADAR_TILE_URL = 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=sample_key';

export const SAMPLE_SEISMIC_ALERTS: SeismicAlert[] = [
  {
    id: 'us7000m1',
    title: 'M 5.4 - 12km E of Hindukush, Afghanistan',
    magnitude: 5.4,
    location: 'Hindukush, Afghanistan',
    depthKm: 185,
    coordinates: [70.8, 36.5],
    time: '25 mins ago',
  },
  {
    id: 'us7000m2',
    title: 'M 4.8 - 45km SW of Tokyo, Japan',
    magnitude: 4.8,
    location: 'Near Coast of Honshu, Japan',
    depthKm: 42,
    coordinates: [139.4, 35.3],
    time: '2 hours ago',
  },
  {
    id: 'us7000m3',
    title: 'M 6.1 - Southern Sumatra, Indonesia',
    magnitude: 6.1,
    location: 'Offshore Sumatra, Indonesia',
    depthKm: 25,
    coordinates: [102.1, -4.5],
    time: '5 hours ago',
  },
];

export interface AqiSensorPoint {
  id: string;
  cityName: string;
  country: string;
  aqiValue: number;
  category: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  coordinates: [number, number];
}

export const SAMPLE_AQI_STATIONS: AqiSensorPoint[] = [
  {
    id: 'aqi_1',
    cityName: 'Chennai',
    country: 'India',
    aqiValue: 48,
    category: 'Good',
    coordinates: [80.27, 13.08],
  },
  {
    id: 'aqi_2',
    cityName: 'New Delhi',
    country: 'India',
    aqiValue: 185,
    category: 'Unhealthy',
    coordinates: [77.2, 28.61],
  },
  {
    id: 'aqi_3',
    cityName: 'Tokyo',
    country: 'Japan',
    aqiValue: 24,
    category: 'Good',
    coordinates: [139.69, 35.68],
  },
  {
    id: 'aqi_4',
    cityName: 'Los Angeles',
    country: 'United States',
    aqiValue: 62,
    category: 'Moderate',
    coordinates: [-118.24, 34.05],
  },
];
