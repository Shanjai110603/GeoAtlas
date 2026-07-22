import { FastifyInstance } from 'fastify';
import { query } from '../db';

export async function compareRoutes(fastify: FastifyInstance) {
  // GET /v1/compare?ids=id1,id2&metrics=...
  fastify.get('/v1/compare', async (request: any, reply: any) => {
    const { ids } = request.query as { ids?: string };
    if (!ids) {
      return reply.code(400).send({ error: 'Missing required query parameter "ids" (comma-separated UUIDs)' });
    }

    const idList = ids.split(',').map((i) => i.trim());
    const res = await query(
      `SELECT id, name, level_number, local_term, country_code,
              ST_Area(geom::geography) / 1000000.0 AS area_sq_km
       FROM admin_levels
       WHERE id = ANY($1::uuid[]);`,
      [idList]
    );

    return {
      comparison: res.rows,
      attribution: 'geoBoundaries / Natural Earth / World Bank (CC-BY 4.0)',
    };
  });
}
