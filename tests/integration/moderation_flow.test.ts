import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';
import { query } from '../../services/api/src/db';

describe('Community Contribution & Moderation Workflow Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /v1/contributions from a new user should queue contribution as pending', async () => {
    const res = await supertest(app.server)
      .post('/v1/contributions')
      .send({
        target_table: 'entities',
        diff: {
          name: 'Community Hospital Chennai',
          entity_type: 'hospital',
          attributes: { emergency: 'yes' }
        }
      });

    expect(res.status).toBe(201);
    expect(res.body.contribution.status).toBe('pending');
    expect(res.body.contribution.id).toBeDefined();

    const contribId = res.body.contribution.id;

    // Verify moderator approval
    const reviewRes = await supertest(app.server)
      .post(`/v1/contributions/${contribId}/review`)
      .send({ action: 'approve' });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.contribution.status).toBe('approved');
  });

  it('POST /v1/contributions from a trusted/official user should auto-approve', async () => {
    // Create official user
    const userRes = await query(
      `INSERT INTO users (email, display_name, trust_tier)
       VALUES ('official_test@domain.org', 'Official Editor', 'official')
       RETURNING id, email, trust_tier;`
    );
    const officialUser = userRes.rows[0];

    const token = app.jwt.sign({ id: officialUser.id, email: officialUser.email, trust_tier: officialUser.trust_tier });

    const res = await supertest(app.server)
      .post('/v1/contributions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        target_table: 'entities',
        diff: {
          name: 'Official Government School',
          entity_type: 'school',
          attributes: { verified: true }
        }
      });

    expect(res.status).toBe(201);
    expect(res.body.contribution.status).toBe('approved');
  });
});
