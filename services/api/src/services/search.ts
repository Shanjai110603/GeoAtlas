import { MeiliSearch } from 'meilisearch';
import { config } from '../config';
import { query } from '../db';

export const meili = new MeiliSearch({
  host: config.meili.host,
  apiKey: config.meili.apiKey,
});

export async function searchGeoAtlas(q: string, type?: string, bbox?: string) {
  try {
    const index = meili.index('geoatlas_entities');
    const filter: string[] = [];

    if (type) {
      filter.push(`entity_type = "${type}"`);
    }

    const searchRes = await index.search(q, {
      filter,
      limit: 20,
    });

    return searchRes.hits;
  } catch (err) {
    // Database fallback search if Meilisearch service is starting up or unavailable
    let sql = `
      SELECT id, entity_type, name, native_name, attributes, confidence_score, source,
             ST_AsGeoJSON(geom)::json AS geometry
      FROM entities
      WHERE name ILIKE $1 OR native_name ILIKE $1
    `;
    const params: any[] = [`%${q}%`];

    if (type) {
      sql += ` AND entity_type = $2`;
      params.push(type);
    }

    sql += ` LIMIT 20;`;

    const dbRes = await query(sql, params);
    return dbRes.rows.map((row) => ({
      ...row,
      attribution: '© OpenStreetMap & GeoAtlas Community (ODbL / CC-BY-SA)',
    }));
  }
}
