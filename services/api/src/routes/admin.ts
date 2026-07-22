import { FastifyInstance } from 'fastify';
import { query } from '../db';

export async function adminRoutes(fastify: FastifyInstance) {
  // GET /v1/admin/:id - Admin unit detail + children
  fastify.get('/v1/admin/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const adminRes = await query(
      `SELECT id, country_code, level_number, local_term, parent_id, name, native_name, source,
              ST_AsGeoJSON(geom)::json AS geometry,
              ST_AsGeoJSON(centroid)::json AS centroid
       FROM admin_levels
       WHERE id = $1;`,
      [id]
    );

    if (adminRes.rows.length === 0) {
      return reply.code(404).send({ error: 'Administrative unit not found' });
    }

    const adminUnit = adminRes.rows[0];

    const childrenRes = await query(
      `SELECT id, level_number, local_term, name, native_name
       FROM admin_levels
       WHERE parent_id = $1
       ORDER BY name ASC;`,
      [id]
    );

    return {
      admin_unit: adminUnit,
      children: childrenRes.rows,
      attribution: 'geoBoundaries / Natural Earth / GeoAtlas (CC-BY 4.0)',
    };
  });

  // GET /v1/admin/:id/hierarchy - Full ancestor chain using closure table
  fastify.get('/v1/admin/:id/hierarchy', async (request, reply) => {
    const { id } = request.params as { id: string };

    const hierarchyRes = await query(
      `SELECT a.id, a.country_code, a.level_number, a.local_term, a.name, a.native_name, c.depth
       FROM admin_hierarchy_closure c
       JOIN admin_levels a ON a.id = c.ancestor_id
       WHERE c.descendant_id = $1
       ORDER BY c.depth DESC;`,
      [id]
    );

    return {
      descendant_id: id,
      ancestors: hierarchyRes.rows,
      attribution: 'geoBoundaries / Natural Earth / GeoAtlas (CC-BY 4.0)',
    };
  });
}
