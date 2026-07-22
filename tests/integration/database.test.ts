import { buildApp } from '../../services/api/src/index';
import { query } from '../../services/api/src/db';

describe('Database & Closure Table Hierarchy Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should auto-populate admin_hierarchy_closure on insert and maintain parent-child links', async () => {
    // Insert Parent (Level 0 - India)
    const parentRes = await query(
      `INSERT INTO admin_levels (country_code, level_number, local_term, name)
       VALUES ('IN', 0, 'Country', 'Test India')
       RETURNING id;`
    );
    const parentId = parentRes.rows[0].id;

    // Insert Child (Level 1 - Tamil Nadu)
    const childRes = await query(
      `INSERT INTO admin_levels (country_code, level_number, local_term, parent_id, name)
       VALUES ('IN', 1, 'State', $1, 'Test Tamil Nadu')
       RETURNING id;`,
      [parentId]
    );
    const childId = childRes.rows[0].id;

    // Verify closure table entries
    const closureRes = await query(
      `SELECT ancestor_id, descendant_id, depth
       FROM admin_hierarchy_closure
       WHERE descendant_id = $1
       ORDER BY depth ASC;`,
      [childId]
    );

    expect(closureRes.rows.length).toBe(2); // (child, child, 0) and (parent, child, 1)
    expect(closureRes.rows[0].depth).toBe(0);
    expect(closureRes.rows[1].ancestor_id).toBe(parentId);
    expect(closureRes.rows[1].depth).toBe(1);
  });

  it('should handle re-parenting correctly in admin_hierarchy_closure when parent_id is updated', async () => {
    // Parent A
    const p1 = (await query(`INSERT INTO admin_levels (country_code, level_number, name) VALUES ('IN', 1, 'State A') RETURNING id;`)).rows[0].id;
    // Parent B
    const p2 = (await query(`INSERT INTO admin_levels (country_code, level_number, name) VALUES ('IN', 1, 'State B') RETURNING id;`)).rows[0].id;
    // District under Parent A
    const dist = (await query(`INSERT INTO admin_levels (country_code, level_number, parent_id, name) VALUES ('IN', 2, $1, 'District X') RETURNING id;`, [p1])).rows[0].id;

    // Re-parent District to Parent B
    await query(`UPDATE admin_levels SET parent_id = $1 WHERE id = $2;`, [p2, dist]);

    // Check new ancestors
    const closureRes = await query(
      `SELECT ancestor_id, depth FROM admin_hierarchy_closure WHERE descendant_id = $1 AND ancestor_id != $1;`,
      [dist]
    );

    expect(closureRes.rows.length).toBe(1);
    expect(closureRes.rows[0].ancestor_id).toBe(p2);
  });
});
