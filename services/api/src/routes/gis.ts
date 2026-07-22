import { FastifyInstance } from 'fastify';
import { query } from '../db';
import { getEntitiesInRadius, calculateRoute } from '../services/gis';

export async function gisRoutes(fastify: FastifyInstance) {
  // GET /v1/gis/buffer?lat=...&lng=...&radius=...
  fastify.get('/v1/gis/buffer', async (request: any, reply: any) => {
    const { lat, lng, radius } = request.query as { lat?: string; lng?: string; radius?: string };
    if (!lat || !lng || !radius) {
      return reply.code(400).send({ error: 'Missing required query parameters: lat, lng, radius (meters)' });
    }

    const bufferRes = await query(
      `SELECT ST_AsGeoJSON(
         ST_Buffer(ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
       )::json AS geometry;`,
      [parseFloat(lng), parseFloat(lat), parseFloat(radius)]
    );

    return {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius_meters: parseFloat(radius),
      buffer_geometry: bufferRes.rows[0]?.geometry,
      attribution: 'GeoAtlas PostGIS Buffer Computation',
    };
  });

  // GET /v1/gis/distance?from=lat,lng&to=lat,lng
  fastify.get('/v1/gis/distance', async (request: any, reply: any) => {
    const { from, to } = request.query as { from?: string; to?: string };
    if (!from || !to) {
      return reply.code(400).send({ error: 'Missing required query parameters: from, to (lat,lng format)' });
    }

    const [fromLat, fromLng] = from.split(',').map((s: string) => parseFloat(s.trim()));
    const [toLat, toLng] = to.split(',').map((s: string) => parseFloat(s.trim()));

    const distRes = await query(
      `SELECT ST_Distance(
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
       ) AS distance_meters;`,
      [fromLng, fromLat, toLng, toLat]
    );

    return {
      from: { lat: fromLat, lng: fromLng },
      to: { lat: toLat, lng: toLng },
      distance_meters: parseFloat(distRes.rows[0]?.distance_meters || '0'),
      attribution: 'GeoAtlas PostGIS Distance Computation',
    };
  });

  // GET /v1/gis/contains?lat=...&lng=...&admin_id=...
  fastify.get('/v1/gis/contains', async (request: any, reply: any) => {
    const { lat, lng, admin_id } = request.query as { lat?: string; lng?: string; admin_id?: string };
    if (!lat || !lng || !admin_id) {
      return reply.code(400).send({ error: 'Missing required query parameters: lat, lng, admin_id' });
    }

    const containsRes = await query(
      `SELECT ST_Contains(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS is_contained
       FROM admin_levels
       WHERE id = $3;`,
      [parseFloat(lng), parseFloat(lat), admin_id]
    );

    return {
      point: { lat: parseFloat(lat), lng: parseFloat(lng) },
      admin_id,
      is_contained: containsRes.rows[0]?.is_contained ?? false,
    };
  });

  // GET /v1/gis/nearest?lat=...&lng=...&type=...&limit=...
  fastify.get('/v1/gis/nearest', async (request: any, reply: any) => {
    const { lat, lng, type, limit } = request.query as { lat?: string; lng?: string; type?: string; limit?: string };
    if (!lat || !lng) {
      return reply.code(400).send({ error: 'Missing required query parameters: lat, lng' });
    }

    const maxResults = parseInt(limit || '10', 10);
    const entities = await getEntitiesInRadius(
      parseFloat(lat),
      parseFloat(lng),
      50000, // 50km default search radius
      type
    );

    return {
      entities: entities.slice(0, maxResults),
      attribution: '© OpenStreetMap contributors / GeoAtlas (ODbL)',
    };
  });
}
