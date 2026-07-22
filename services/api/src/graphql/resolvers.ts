import { query } from '../db';
import { searchGeoAtlas } from '../services/search';
import { getEntitiesInRadius } from '../services/gis';

export const resolvers = {
  Query: {
    adminUnit: async (_: any, { id }: { id: string }) => {
      const res = await query(`SELECT * FROM admin_levels WHERE id = $1;`, [id]);
      return res.rows[0] || null;
    },
    entity: async (_: any, { id }: { id: string }) => {
      const res = await query(`SELECT * FROM entities WHERE id = $1;`, [id]);
      if (!res.rows[0]) return null;
      return {
        ...res.rows[0],
        attributes: JSON.stringify(res.rows[0].attributes),
      };
    },
    searchEntities: async (_: any, { q, type }: { q: string; type?: string }) => {
      const searchRes = await searchGeoAtlas(q, type);
      const items = Array.isArray(searchRes) ? searchRes : (searchRes?.hits || []);
      return items.map((hit: any) => ({
        ...hit,
        attributes: JSON.stringify(hit.attributes || {}),
      }));
    },
    entitiesInRadius: async (_: any, { lat, lng, radiusMeters, type }: { lat: number; lng: number; radiusMeters: number; type?: string }) => {
      const hits = await getEntitiesInRadius(lat, lng, radiusMeters, type);
      return hits.map((hit: any) => ({
        ...hit,
        attributes: JSON.stringify(hit.attributes || {}),
      }));
    },
  },
  AdminLevel: {
    children: async (parent: any) => {
      const res = await query(`SELECT * FROM admin_levels WHERE parent_id = $1 ORDER BY name ASC;`, [parent.id]);
      return res.rows;
    },
    ancestors: async (parent: any) => {
      const res = await query(
        `SELECT a.*
         FROM admin_hierarchy_closure c
         JOIN admin_levels a ON a.id = c.ancestor_id
         WHERE c.descendant_id = $1 AND c.ancestor_id != $1
         ORDER BY c.depth DESC;`,
        [parent.id]
      );
      return res.rows;
    },
    entities: async (parent: any, { type }: { type?: string }) => {
      let sql = `SELECT * FROM entities WHERE admin_level_id = $1`;
      const params: any[] = [parent.id];
      if (type) {
        sql += ` AND entity_type = $2`;
        params.push(type);
      }
      sql += ` LIMIT 50;`;
      const res = await query(sql, params);
      return res.rows.map((row: any) => ({
        ...row,
        attributes: JSON.stringify(row.attributes),
      }));
    },
  },
  Entity: {
    reviews: async (parent: any) => {
      const res = await query(
        `SELECT r.id, r.rating, r.text, r.photos, r.created_at, u.display_name
         FROM reviews r
         LEFT JOIN users u ON u.id = r.user_id
         WHERE r.entity_id = $1 AND r.status = 'approved'
         ORDER BY r.created_at DESC;`,
        [parent.id]
      );
      return res.rows.map((row: any) => ({
        ...row,
        photos: JSON.stringify(row.photos),
        created_at: row.created_at ? row.created_at.toISOString() : null,
      }));
    },
  },
};
