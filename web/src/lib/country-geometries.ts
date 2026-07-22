export interface DetailedCountryPreset {
  id: string;
  name: string;
  continent: string;
  color: string;
  area_sq_km: number;
  originCenter: [number, number];
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export const DETAILED_COUNTRY_PRESETS: DetailedCountryPreset[] = [
  // --- NORTH AMERICA ---
  {
    id: 'canada',
    name: 'Canada',
    continent: 'North America',
    color: '#ef4444',
    area_sq_km: 9984670,
    originCenter: [-106.3, 56.1],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-141.0, 69.6], [-130.0, 70.0], [-110.0, 78.0], [-75.0, 75.0], [-60.0, 60.0],
        [-52.6, 47.5], [-66.9, 44.8], [-79.0, 43.5], [-89.5, 48.0], [-95.1, 49.3],
        [-123.0, 49.0], [-130.0, 55.0], [-141.0, 60.0], [-141.0, 69.6]
      ]]
    }
  },
  {
    id: 'greenland',
    name: 'Greenland',
    continent: 'North America',
    color: '#00f0ff',
    area_sq_km: 2166086,
    originCenter: [-42.5, 71.5],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.2, 78.2], [-69.8, 76.1], [-65.0, 76.5], [-62.4, 76.0], [-58.0, 72.0],
        [-55.1, 70.2], [-52.0, 68.0], [-49.8, 64.1], [-45.0, 61.5], [-43.9, 60.0],
        [-41.5, 60.2], [-39.5, 61.5], [-37.0, 63.5], [-35.0, 65.8], [-28.0, 68.5],
        [-23.4, 70.4], [-20.0, 74.0], [-18.5, 76.5], [-19.1, 81.3], [-22.0, 82.5],
        [-27.2, 83.6], [-35.0, 83.7], [-40.0, 83.6], [-50.0, 83.0], [-58.2, 82.1],
        [-65.0, 80.5], [-73.2, 78.2]
      ]]
    }
  },
  {
    id: 'united_states',
    name: 'United States',
    continent: 'North America',
    color: '#ffe600',
    area_sq_km: 9833517,
    originCenter: [-98.5, 39.8],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-124.7, 48.3], [-120.0, 49.0], [-117.2, 49.0], [-104.0, 49.0], [-95.1, 49.3],
        [-89.5, 48.0], [-82.5, 45.4], [-79.0, 43.5], [-75.0, 45.0], [-71.0, 45.2],
        [-66.9, 44.8], [-70.0, 41.5], [-74.0, 39.0], [-76.0, 37.0], [-80.1, 25.1],
        [-82.5, 28.0], [-87.5, 30.2], [-90.0, 29.2], [-93.8, 29.8], [-97.1, 26.0],
        [-100.0, 28.0], [-104.5, 29.5], [-106.5, 31.8], [-111.0, 31.3], [-114.7, 32.7],
        [-117.1, 32.5], [-120.5, 35.0], [-124.3, 40.0], [-124.7, 48.3]
      ]]
    }
  },
  {
    id: 'mexico',
    name: 'Mexico',
    continent: 'North America',
    color: '#34d399',
    area_sq_km: 1964375,
    originCenter: [-102.5, 23.6],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-117.1, 32.5], [-111.0, 31.3], [-106.5, 31.8], [-100.0, 28.0], [-97.1, 26.0],
        [-97.5, 22.0], [-91.0, 18.5], [-87.0, 21.5], [-89.0, 17.5], [-92.5, 14.5],
        [-96.0, 16.0], [-105.0, 19.5], [-110.0, 23.0], [-114.5, 30.0], [-117.1, 32.5]
      ]]
    }
  },
  {
    id: 'cuba',
    name: 'Cuba',
    continent: 'North America',
    color: '#38bdf8',
    area_sq_km: 109884,
    originCenter: [-79.5, 21.5],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-84.9, 21.8], [-80.5, 23.1], [-74.1, 20.2], [-77.5, 19.8], [-84.9, 21.8]
      ]]
    }
  },
  {
    id: 'guatemala',
    name: 'Guatemala',
    continent: 'North America',
    color: '#a855f7',
    area_sq_km: 108889,
    originCenter: [-90.2, 15.7],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-92.2, 15.0], [-90.0, 17.8], [-89.1, 15.8], [-90.2, 13.7], [-92.2, 15.0]
      ]]
    }
  },

  // --- SOUTH AMERICA ---
  {
    id: 'brazil',
    name: 'Brazil',
    continent: 'South America',
    color: '#a855f7',
    area_sq_km: 8515767,
    originCenter: [-51.9, -14.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.9, -7.5], [-70.0, -4.0], [-69.8, -1.0], [-64.0, 2.0], [-60.0, 2.2],
        [-52.0, 4.5], [-51.0, 4.0], [-47.0, -0.5], [-44.0, -2.5], [-37.0, -5.0],
        [-34.7, -7.5], [-37.0, -11.0], [-38.5, -13.0], [-41.0, -20.0], [-44.0, -23.0],
        [-48.5, -25.5], [-53.1, -33.7], [-55.0, -30.0], [-57.6, -30.0], [-58.0, -20.0],
        [-62.0, -15.0], [-65.0, -10.0], [-73.9, -7.5]
      ]]
    }
  },
  {
    id: 'argentina',
    name: 'Argentina',
    continent: 'South America',
    color: '#38bdf8',
    area_sq_km: 2780400,
    originCenter: [-63.6, -38.4],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-68.6, -22.0], [-62.0, -22.2], [-57.6, -27.5], [-58.0, -34.5], [-62.0, -39.0],
        [-65.0, -43.0], [-67.0, -54.8], [-73.0, -52.0], [-72.0, -44.0], [-70.5, -34.0],
        [-69.5, -27.0], [-68.6, -22.0]
      ]]
    }
  },
  {
    id: 'colombia',
    name: 'Colombia',
    continent: 'South America',
    color: '#facc15',
    area_sq_km: 1141748,
    originCenter: [-74.3, 4.57],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-75.5, 11.8], [-71.2, 11.8], [-67.4, 1.8], [-70.0, -4.2], [-75.0, -0.1],
        [-79.0, 1.5], [-77.5, 7.2], [-75.5, 11.8]
      ]]
    }
  },
  {
    id: 'peru',
    name: 'Peru',
    continent: 'South America',
    color: '#fb923c',
    area_sq_km: 1285216,
    originCenter: [-75.0, -9.19],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-81.3, -4.6], [-75.2, -0.04], [-69.4, -12.5], [-70.3, -18.3], [-79.0, -12.0],
        [-81.3, -4.6]
      ]]
    }
  },
  {
    id: 'chile',
    name: 'Chile',
    continent: 'South America',
    color: '#e11d48',
    area_sq_km: 756102,
    originCenter: [-71.5, -35.6],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-70.3, -18.3], [-67.0, -23.0], [-69.5, -27.0], [-70.5, -34.0], [-73.0, -52.0],
        [-67.0, -55.0], [-75.0, -45.0], [-74.0, -38.0], [-70.3, -18.3]
      ]]
    }
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    continent: 'South America',
    color: '#10b981',
    area_sq_km: 916445,
    originCenter: [-66.5, 6.42],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.3, 11.8], [-60.0, 8.5], [-60.7, 5.0], [-67.0, 1.2], [-73.0, 8.0], [-73.3, 11.8]
      ]]
    }
  },
  {
    id: 'bolivia',
    name: 'Bolivia',
    continent: 'South America',
    color: '#eab308',
    area_sq_km: 1098581,
    originCenter: [-63.5, -16.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-69.5, -10.0], [-60.0, -14.0], [-57.5, -20.0], [-62.0, -22.5], [-69.5, -22.8], [-69.5, -10.0]
      ]]
    }
  },

  // --- EUROPE ---
  {
    id: 'russia',
    name: 'Russia',
    continent: 'Europe / Asia',
    color: '#f97316',
    area_sq_km: 17098246,
    originCenter: [105.3, 61.5],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [27.5, 69.8], [33.0, 69.0], [45.0, 68.0], [60.0, 68.5], [75.0, 73.0],
        [100.0, 78.0], [130.0, 73.0], [170.0, 68.0], [180.0, 65.0], [160.0, 55.0],
        [135.0, 48.0], [131.0, 43.0], [120.0, 50.0], [90.0, 50.0], [80.0, 51.0],
        [60.0, 55.0], [50.0, 52.0], [40.0, 45.0], [38.0, 55.0], [30.0, 60.0], [27.5, 69.8]
      ]]
    }
  },
  {
    id: 'france',
    name: 'France',
    continent: 'Europe',
    color: '#6366f1',
    area_sq_km: 643801,
    originCenter: [2.2, 46.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-4.8, 48.4], [1.9, 50.9], [7.5, 49.0], [7.5, 47.5], [6.8, 45.8],
        [7.5, 43.7], [3.1, 42.5], [-1.8, 43.4], [-1.2, 46.0], [-4.8, 48.4]
      ]]
    }
  },
  {
    id: 'germany',
    name: 'Germany',
    continent: 'Europe',
    color: '#eab308',
    area_sq_km: 357022,
    originCenter: [10.4, 51.1],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [6.0, 50.8], [8.6, 54.9], [14.1, 53.8], [15.0, 51.1], [13.8, 48.7],
        [10.4, 47.5], [7.5, 47.5], [6.0, 49.0], [6.0, 50.8]
      ]]
    }
  },
  {
    id: 'united_kingdom',
    name: 'United Kingdom',
    continent: 'Europe',
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
  },
  {
    id: 'italy',
    name: 'Italy',
    continent: 'Europe',
    color: '#10b981',
    area_sq_km: 301340,
    originCenter: [12.5, 41.9],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [6.6, 45.1], [13.8, 46.5], [13.0, 43.5], [18.5, 40.2], [15.6, 38.0],
        [15.0, 40.0], [11.0, 43.8], [8.5, 44.4], [6.6, 45.1]
      ]]
    }
  },
  {
    id: 'spain',
    name: 'Spain',
    continent: 'Europe',
    color: '#f43f5e',
    area_sq_km: 505990,
    originCenter: [-3.7, 40.4],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-9.3, 43.0], [-1.8, 43.4], [3.3, 42.4], [0.3, 38.8], [-5.6, 36.0],
        [-7.5, 37.2], [-9.0, 39.5], [-9.3, 43.0]
      ]]
    }
  },
  {
    id: 'poland',
    name: 'Poland',
    continent: 'Europe',
    color: '#f43f5e',
    area_sq_km: 312696,
    originCenter: [19.1, 51.9],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [14.1, 53.8], [18.8, 54.8], [23.5, 53.5], [24.0, 50.8], [19.0, 49.2], [14.8, 50.8], [14.1, 53.8]
      ]]
    }
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    continent: 'Europe',
    color: '#f97316',
    area_sq_km: 41543,
    originCenter: [5.29, 52.1],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [3.4, 51.4], [7.2, 53.4], [7.1, 51.8], [6.0, 50.8], [3.4, 51.4]
      ]]
    }
  },
  {
    id: 'greece',
    name: 'Greece',
    continent: 'Europe',
    color: '#0284c7',
    area_sq_km: 131957,
    originCenter: [21.8, 39.0],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [20.0, 39.5], [23.0, 41.5], [26.5, 41.5], [27.0, 38.0], [23.0, 35.0], [20.0, 39.5]
      ]]
    }
  },

  // --- ASIA ---
  {
    id: 'india',
    name: 'India',
    continent: 'Asia',
    color: '#ff007f',
    area_sq_km: 3287263,
    originCenter: [78.96, 20.59],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68.1, 23.6], [70.0, 26.0], [70.5, 28.5], [73.0, 31.0], [74.5, 32.5],
        [76.8, 34.5], [78.5, 35.5], [79.2, 33.0], [80.2, 30.5], [81.5, 29.0],
        [85.0, 27.5], [88.1, 27.3], [89.0, 26.5], [92.0, 27.8], [94.5, 29.0],
        [96.0, 28.2], [96.5, 27.0], [94.5, 24.5], [92.2, 22.0], [90.0, 21.8],
        [88.5, 21.6], [85.5, 19.8], [83.0, 18.0], [80.2, 13.0], [79.8, 10.0],
        [77.5, 8.1], [76.5, 9.2], [76.0, 10.5], [74.8, 13.0], [73.5, 15.2],
        [72.8, 19.5], [70.0, 21.5], [68.1, 23.6]
      ]]
    }
  },
  {
    id: 'china',
    name: 'China',
    continent: 'Asia',
    color: '#00ff66',
    area_sq_km: 9596961,
    originCenter: [104.1, 35.8],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [73.5, 39.4], [78.0, 43.0], [87.5, 49.1], [96.0, 42.5], [105.0, 42.0],
        [115.0, 40.0], [121.0, 53.5], [131.0, 45.0], [122.0, 30.0], [118.0, 24.5],
        [110.0, 20.0], [108.0, 21.5], [100.0, 21.2], [98.0, 25.0], [92.0, 28.0],
        [80.0, 30.0], [75.0, 37.0], [73.5, 39.4]
      ]]
    }
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    continent: 'Asia',
    color: '#ec4899',
    area_sq_km: 1904569,
    originCenter: [113.9, -0.78],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [95.3, 5.5], [105.0, -6.0], [115.0, -8.5], [125.0, -9.0], [141.0, -2.5],
        [140.0, -9.0], [128.0, -3.0], [118.0, 5.0], [95.3, 5.5]
      ]]
    }
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    continent: 'Asia',
    color: '#10b981',
    area_sq_km: 881912,
    originCenter: [69.3, 30.3],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [61.0, 25.0], [66.0, 24.0], [70.0, 28.0], [75.0, 37.0], [71.0, 35.0],
        [68.0, 33.0], [61.0, 29.0], [61.0, 25.0]
      ]]
    }
  },
  {
    id: 'japan',
    name: 'Japan',
    continent: 'Asia',
    color: '#38bdf8',
    area_sq_km: 377975,
    originCenter: [138.2, 36.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [129.5, 31.2], [131.0, 34.0], [135.0, 34.5], [140.0, 35.5], [141.5, 41.0],
        [145.0, 44.0], [141.0, 45.5], [139.5, 41.8], [136.5, 36.5], [130.5, 33.0],
        [129.5, 31.2]
      ]]
    }
  },
  {
    id: 'turkey',
    name: 'Turkey',
    continent: 'Asia / Europe',
    color: '#f43f5e',
    area_sq_km: 783562,
    originCenter: [35.2, 38.9],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [26.0, 40.0], [30.0, 42.0], [42.0, 41.5], [44.5, 37.5], [36.0, 36.0], [27.0, 36.5], [26.0, 40.0]
      ]]
    }
  },
  {
    id: 'thailand',
    name: 'Thailand',
    continent: 'Asia',
    color: '#eab308',
    area_sq_km: 513120,
    originCenter: [100.9, 15.8],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [98.0, 19.5], [101.0, 20.0], [105.5, 15.0], [102.5, 11.5], [99.0, 6.5], [98.0, 10.0], [98.0, 19.5]
      ]]
    }
  },

  // --- AFRICA ---
  {
    id: 'nigeria',
    name: 'Nigeria',
    continent: 'Africa',
    color: '#10b981',
    area_sq_km: 923768,
    originCenter: [8.6, 9.0],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [3.0, 6.5], [3.5, 11.0], [11.5, 13.8], [14.0, 12.5], [12.0, 7.0], [7.0, 4.5], [3.0, 6.5]
      ]]
    }
  },
  {
    id: 'egypt',
    name: 'Egypt',
    continent: 'Africa',
    color: '#f59e0b',
    area_sq_km: 1010408,
    originCenter: [30.8, 26.8],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [25.0, 31.5], [34.0, 31.3], [35.0, 29.5], [37.0, 22.0], [22.0, 22.0], [25.0, 31.5]
      ]]
    }
  },
  {
    id: 'south_africa',
    name: 'South Africa',
    continent: 'Africa',
    color: '#84cc16',
    area_sq_km: 1221037,
    originCenter: [22.9, -30.5],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [16.4, -28.5], [20.0, -27.0], [26.0, -22.0], [32.9, -26.0], [32.0, -33.0],
        [25.0, -34.0], [18.5, -34.8], [16.4, -28.5]
      ]]
    }
  },
  {
    id: 'kenya',
    name: 'Kenya',
    continent: 'Africa',
    color: '#38bdf8',
    area_sq_km: 580367,
    originCenter: [37.9, -0.02],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [34.0, 4.5], [41.8, 3.9], [41.0, -1.6], [39.0, -4.7], [34.0, -1.0], [34.0, 4.5]
      ]]
    }
  },
  {
    id: 'morocco',
    name: 'Morocco',
    continent: 'Africa',
    color: '#ef4444',
    area_sq_km: 446550,
    originCenter: [-7.0, 31.7],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-13.0, 27.6], [-5.0, 36.0], [-1.0, 35.0], [-4.0, 31.0], [-13.0, 27.6]
      ]]
    }
  },

  // --- OCEANIA ---
  {
    id: 'australia',
    name: 'Australia',
    continent: 'Oceania',
    color: '#06b6d4',
    area_sq_km: 7692024,
    originCenter: [133.7, -25.2],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [113.5, -25.8], [114.0, -21.5], [121.5, -18.5], [128.0, -15.0], [130.5, -12.0],
        [136.0, -12.0], [142.5, -10.8], [143.5, -15.0], [150.0, -22.0], [153.6, -28.2],
        [152.0, -32.0], [150.0, -37.5], [145.0, -38.5], [138.0, -35.5], [130.0, -31.5],
        [120.0, -34.0], [115.0, -34.5], [113.5, -25.8]
      ]]
    }
  },
  {
    id: 'new_zealand',
    name: 'New Zealand',
    continent: 'Oceania',
    color: '#f43f5e',
    area_sq_km: 268021,
    originCenter: [174.8, -40.9],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [172.5, -34.4], [178.5, -37.5], [175.5, -41.5], [174.0, -47.0], [166.5, -46.0], [172.5, -34.4]
      ]]
    }
  }
];
