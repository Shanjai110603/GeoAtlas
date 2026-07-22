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
    const parentRes = await query(
      `INSERT INTO admin_levels (country_code, level_number, local_term, name)
       VALUES ('IN', 0, 'Country', 'Test India')
       RETURNING id;`
    );
    const parentId = parentRes.rows[0].id;

    const childRes = await query(
      `INSERT INTO admin_levels (country_code, level_number, local_term, parent_id, name)
       VALUES ('IN', 1, 'State', $1, 'Test Tamil Nadu')
       RETURNING id;`,
      [parentId]
    );
    const childId = childRes.rows[0].id;

    const closureRes = await query(
      `SELECT ancestor_id, descendant_id, depth
       FROM admin_hierarchy_closure
       WHERE descendant_id = $1
       ORDER BY depth ASC;`,
      [childId]
    );

    expect(closureRes.rows.length).toBe(2);
    expect(closureRes.rows[0].depth).toBe(0);
    expect(closureRes.rows[1].ancestor_id).toBe(parentId);
    expect(closureRes.rows[1].depth).toBe(1);
  });

  it('should handle sub-tree re-parenting correctly in admin_hierarchy_closure when parent_id is updated', async () => {
    // State 1 (Parent A)
    const stateA = (await query(`INSERT INTO admin_levels (country_code, level_number, name) VALUES ('IN', 1, 'State A') RETURNING id;`)).rows[0].id;
    // State 2 (Parent B)
    const stateB = (await query(`INSERT INTO admin_levels (country_code, level_number, name) VALUES ('IN', 1, 'State B') RETURNING id;`)).rows[0].id;

    // District under State A
    const district = (await query(`INSERT INTO admin_levels (country_code, level_number, parent_id, name) VALUES ('IN', 2, $1, 'District X') RETURNING id;`, [stateA])).rows[0].id;

    // Sub-district (Taluk) under District X
    const taluk = (await query(`INSERT INTO admin_levels (country_code, level_number, parent_id, name) VALUES ('IN', 3, $1, 'Taluk Y') RETURNING id;`, [district])).rows[0].id;

    // Before move: Taluk Y has State A as ancestor
    const beforeAncestors = await query(`SELECT ancestor_id FROM admin_hierarchy_closure WHERE descendant_id = $1 AND ancestor_id = $2;`, [taluk, stateA]);
    expect(beforeAncestors.rows.length).toBe(1);

    // Re-parent District X from State A to State B
    await query(`UPDATE admin_levels SET parent_id = $1 WHERE id = $2;`, [stateB, district]);

    // After move: District X has State B as ancestor, NOT State A
    const districtAncestors = await query(`SELECT ancestor_id FROM admin_hierarchy_closure WHERE descendant_id = $1 AND ancestor_id != $1;`, [district]);
    expect(districtAncestors.rows.length).toBe(1);
    expect(districtAncestors.rows[0].ancestor_id).toBe(stateB);

    // After move: Sub-district Taluk Y NOW has State B as ancestor, NOT State A!
    const talukAncestors = await query(`SELECT ancestor_id FROM admin_hierarchy_closure WHERE descendant_id = $1;`, [taluk]);
    const ancestorIds = talukAncestors.rows.map((r: any) => r.ancestor_id);

    expect(ancestorIds).toContain(stateB);
    expect(ancestorIds).not.toContain(stateA);
  });
});
