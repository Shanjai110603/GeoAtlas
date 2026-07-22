import { query } from '../db';
import axios from 'axios';
import { config } from '../config';

export async function getEntitiesInRadius(lat: number, lng: number, radiusMeters: number, type?: string) {
  let sql = `
    SELECT id, entity_type, name, native_name, attributes, confidence_score, source,
           ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_meters,
           ST_AsGeoJSON(geom)::json AS geometry
    FROM entities
    WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
  `;
  const params: any[] = [lng, lat, radiusMeters];

  if (type) {
    sql += ` AND entity_type = $4`;
    params.push(type);
  }

  sql += ` ORDER BY distance_meters ASC LIMIT 50;`;

  const res = await query(sql, params);
  return res.rows;
}

export async function calculateRoute(fromLat: number, fromLng: number, toLat: number, toLng: number, mode: string = 'driving') {
  try {
    const url = `${config.osrmUrl}/route/v1/${mode}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const res = await axios.get(url, { timeout: 5000 });
    return {
      code: res.data.code,
      routes: res.data.routes,
      waypoints: res.data.waypoints,
      attribution: '© OSRM & OpenStreetMap contributors (ODbL)',
    };
  } catch (err) {
    // Fallback direct distance line estimation
    const distRes = await query(
      `SELECT ST_Distance(
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
       ) as distance_meters;`,
      [fromLng, fromLat, toLng, toLat]
    );

    const distanceMeters = parseFloat(distRes.rows[0]?.distance_meters || '1000');
    const estimatedDurationSeconds = Math.round(distanceMeters / 12.5); // ~45km/h speed estimate

    return {
      code: 'Ok',
      routes: [
        {
          distance: distanceMeters,
          duration: estimatedDurationSeconds,
          geometry: {
            type: 'LineString',
            coordinates: [
              [fromLng, fromLat],
              [toLng, toLat],
            ],
          },
        },
      ],
      waypoints: [
        { location: [fromLng, fromLat], name: 'Origin' },
        { location: [toLng, toLat], name: 'Destination' },
      ],
      attribution: 'GeoAtlas Direct GIS Estimation Proxy (ODbL)',
    };
  }
}
