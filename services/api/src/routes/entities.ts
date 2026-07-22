import { FastifyInstance } from 'fastify';
import { query } from '../db';
import { getEntitiesInRadius } from '../services/gis';

export async function entityRoutes(fastify: FastifyInstance) {
  // GET /v1/entities/:id
  fastify.get('/v1/entities/:id', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };

    const res = await query(
      `SELECT id, entity_type, name, native_name, admin_level_id, attributes, confidence_score, source, source_id,
              ST_AsGeoJSON(geom)::json AS geometry
       FROM entities
       WHERE id = $1;`,
      [id]
    );

    if (res.rows.length === 0) {
      return reply.code(404).send({ error: 'Entity not found' });
    }

    return {
      entity: res.rows[0],
      attribution: '© OpenStreetMap contributors / GeoNames / GeoAtlas Community (ODbL / CC-BY)',
    };
  });

  // GET /v1/entities?type=...&near=lat,lng&radius=...
  fastify.get('/v1/entities', async (request: any, reply: any) => {
    const { type, near, radius } = request.query as { type?: string; near?: string; radius?: string };

    if (near && radius) {
      const [latStr, lngStr] = near.split(',');
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      const radiusMeters = parseFloat(radius);

      const items = await getEntitiesInRadius(lat, lng, radiusMeters, type);
      return {
        entities: items,
        attribution: '© OpenStreetMap contributors / GeoNames / GeoAtlas Community (ODbL / CC-BY)',
      };
    }

    let sql = `
      SELECT id, entity_type, name, native_name, admin_level_id, attributes, confidence_score, source,
             ST_AsGeoJSON(geom)::json AS geometry
      FROM entities
    `;
    const params: any[] = [];

    if (type) {
      sql += ` WHERE entity_type = $1`;
      params.push(type);
    }

    sql += ` LIMIT 50;`;

    const dbRes = await query(sql, params);
    return {
      entities: dbRes.rows,
      attribution: '© OpenStreetMap contributors / GeoNames / GeoAtlas Community (ODbL / CC-BY)',
    };
  });
}
