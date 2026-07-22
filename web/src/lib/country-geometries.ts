export interface DetailedCountryPreset {
  id: string;
  name: string;
  color: string;
  area_sq_km: number;
  originCenter: [number, number];
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export const DETAILED_COUNTRY_PRESETS: DetailedCountryPreset[] = [
  {
    id: 'greenland',
    name: 'Greenland',
    color: '#ef4444',
    area_sq_km: 2166086,
    originCenter: [-42.5, 71.5],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.2, 78.2], [-69.8, 76.1], [-62.4, 76.0], [-55.1, 70.2], [-49.8, 64.1],
        [-43.9, 60.0], [-39.5, 61.5], [-35.0, 65.8], [-23.4, 70.4], [-18.5, 76.5],
        [-19.1, 81.3], [-27.2, 83.6], [-40.0, 83.6], [-58.2, 82.1], [-73.2, 78.2]
      ]]
    }
  },
  {
    id: 'india',
    name: 'India',
    color: '#3b82f6',
    area_sq_km: 3287263,
    originCenter: [78.96, 20.59],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68.1, 23.6], [70.5, 28.5], [74.5, 32.5], [78.5, 35.5], [80.2, 30.5],
        [88.1, 27.3], [92.0, 27.8], [96.0, 28.2], [94.5, 24.5], [92.2, 22.0],
        [88.5, 21.6], [83.0, 18.0], [80.2, 13.0], [77.5, 8.1], [76.0, 10.5],
        [73.5, 15.2], [72.8, 19.5], [68.1, 23.6]
      ]]
    }
  },
  {
    id: 'united_states',
    name: 'United States',
    color: '#10b981',
    area_sq_km: 9833517,
    originCenter: [-98.5, 39.8],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-124.7, 48.3], [-117.2, 49.0], [-104.0, 49.0], [-95.1, 49.3], [-89.5, 48.0],
        [-82.5, 45.4], [-71.0, 45.2], [-66.9, 44.8], [-70.0, 41.5], [-74.0, 39.0],
        [-80.1, 25.1], [-87.5, 30.2], [-93.8, 29.8], [-97.1, 26.0], [-106.5, 31.8],
        [-114.7, 32.7], [-117.1, 32.5], [-124.3, 40.0], [-124.7, 48.3]
      ]]
    }
  },
  {
    id: 'brazil',
    name: 'Brazil',
    color: '#f59e0b',
    area_sq_km: 8515767,
    originCenter: [-51.9, -14.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.9, -7.5], [-69.8, -1.0], [-60.0, 2.2], [-51.0, 4.0], [-47.0, -0.5],
        [-37.0, -5.0], [-34.7, -7.5], [-38.5, -13.0], [-41.0, -20.0], [-48.5, -25.5],
        [-53.1, -33.7], [-57.6, -30.0], [-58.0, -20.0], [-65.0, -10.0], [-73.9, -7.5]
      ]]
    }
  },
  {
    id: 'australia',
    name: 'Australia',
    color: '#8b5cf6',
    area_sq_km: 7692024,
    originCenter: [133.7, -25.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [113.5, -25.8], [121.5, -18.5], [130.5, -12.0], [142.5, -10.8], [153.6, -28.2],
        [150.0, -37.5], [138.0, -35.5], [130.0, -31.5], [115.0, -34.5], [113.5, -25.8]
      ]]
    }
  },
  {
    id: 'united_kingdom',
    name: 'United Kingdom',
    color: '#ec4899',
    area_sq_km: 242495,
    originCenter: [-2.5, 54.5],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-5.8, 58.6], [-3.0, 58.5], [-2.0, 57.5], [-1.8, 55.5], [1.7, 52.5],
        [0.8, 50.7], [-5.2, 50.0], [-4.5, 52.0], [-3.0, 53.5], [-5.8, 58.6]
      ]]
    }
  }
];
