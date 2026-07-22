import { MeiliSearch } from 'meilisearch';
import { config } from '../config';
import { query } from '../db';

export const meili = new MeiliSearch({
  host: config.meili.host,
  apiKey: config.meili.apiKey,
});

export async function searchGeoAtlas(
  q: string,
  type?: string,
  bbox?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ hits: any[]; totalHits: number }> {
  try {
    const index = meili.index('geoatlas_entities');
    const filter: string[] = [];

    if (type) {
      filter.push(`entity_type = "${type}"`);
    }

    const searchRes = await index.search(q, {
      filter,
      limit,
      offset,
    });

    return {
      hits: searchRes.hits,
      totalHits: (searchRes as any).estimatedTotalHits || searchRes.hits.length,
    };
  } catch (err) {
    // Database fallback search if Meilisearch service is starting up or unavailable
    let sql = `
      SELECT id, entity_type, name, native_name, attributes, confidence_score, source,
             ST_AsGeoJSON(geom)::json AS geometry
      FROM entities
      WHERE name ILIKE $1 OR native_name ILIKE $1
    `;
    const params: any[] = [`%${q}%`];
    let paramIndex = 2;

    if (type) {
      sql += ` AND entity_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Count total before limiting
    const countSql = sql.replace(
      /SELECT .+ FROM/,
      'SELECT COUNT(*)::int as total FROM'
    );
    const countRes = await query(countSql, params);
    const totalHits = countRes.rows[0]?.total || 0;

    sql += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`;
    params.push(limit, offset);

    const dbRes = await query(sql, params);
    return {
      hits: dbRes.rows.map((row) => ({
        ...row,
        attribution: '© OpenStreetMap & GeoAtlas Community (ODbL / CC-BY-SA)',
      })),
      totalHits,
    };
  }
}
