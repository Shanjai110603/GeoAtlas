import { FastifyInstance } from 'fastify';
import { query } from '../db';

export async function statisticsRoutes(fastify: FastifyInstance) {
  // GET /v1/statistics/:admin_id?category=...
  fastify.get('/v1/statistics/:admin_id', async (request: any, reply: any) => {
    const { admin_id } = request.params as { admin_id: string };
    const { category } = request.query as { category?: string };

    // Verify admin unit exists
    const adminRes = await query(
      `SELECT id, name, country_code, level_number FROM admin_levels WHERE id = $1;`,
      [admin_id]
    );

    if (adminRes.rows.length === 0) {
      return reply.code(404).send({ error: 'Administrative unit not found' });
    }

    // Entity type counts within this admin unit
    const entityCounts = await query(
      `SELECT entity_type, COUNT(*)::int as count
       FROM entities
       WHERE admin_level_id = $1
       GROUP BY entity_type
       ORDER BY count DESC;`,
      [admin_id]
    );

    // Child admin unit count
    const childCount = await query(
      `SELECT COUNT(*)::int as count FROM admin_levels WHERE parent_id = $1;`,
      [admin_id]
    );

    // Area calculation
    const areaRes = await query(
      `SELECT ST_Area(geom::geography) / 1000000.0 AS area_sq_km
       FROM admin_levels WHERE id = $1;`,
      [admin_id]
    );

    return {
      admin_unit: adminRes.rows[0],
      statistics: {
        entity_counts: entityCounts.rows,
        child_admin_units: childCount.rows[0]?.count ?? 0,
        area_sq_km: parseFloat(areaRes.rows[0]?.area_sq_km || '0'),
      },
      attribution: 'GeoAtlas Statistics / World Bank Open Data (CC-BY 4.0)',
    };
  });
}
