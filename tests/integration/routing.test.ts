import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';

describe('OSRM Routing Correctness Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /v1/route should return route geometry between two Tamil Nadu coordinates', async () => {
    // Chennai -> Coimbatore (same regional extract)
    const res = await supertest(app.server).get(
      '/v1/route?from=13.0827,80.2707&to=11.0168,76.9558&mode=driving'
    );

    expect(res.status).toBe(200);
    expect(res.body.routes).toBeDefined();
    expect(res.body.routes.length).toBeGreaterThan(0);
    expect(res.body.routes[0].distance).toBeGreaterThan(0);
    expect(res.body.routes[0].duration).toBeGreaterThan(0);
    expect(res.body.routes[0].geometry).toBeDefined();
    expect(res.body.attribution).toBeDefined();
  });

  it('GET /v1/route should return a valid response for short-distance routing within Chennai', async () => {
    // T.Nagar -> Egmore
    const res = await supertest(app.server).get(
      '/v1/route?from=13.0418,80.2341&to=13.0732,80.2609&mode=driving'
    );

    expect(res.status).toBe(200);
    expect(res.body.code).toBe('Ok');
    expect(res.body.waypoints).toBeDefined();
    expect(res.body.waypoints.length).toBe(2);
  });

  it('GET /v1/route should return 400 when from or to is missing', async () => {
    const res = await supertest(app.server).get('/v1/route?from=13.0827,80.2707');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
