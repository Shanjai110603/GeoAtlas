import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';

describe('Search, Geocoding & GIS API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /v1/geocode should return structured address and licensing attribution', async () => {
    const res = await supertest(app.server).get('/v1/geocode?address=Chennai');
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.attribution).toContain('OpenStreetMap');
  });

  it('GET /v1/reverse-geocode should return location metadata for coordinates', async () => {
    const res = await supertest(app.server).get('/v1/reverse-geocode?lat=13.0827&lng=80.2707');
    expect(res.status).toBe(200);
    expect(res.body.display_name).toBeDefined();
    expect(res.body.attribution).toContain('OpenStreetMap');
  });

  it('GET /v1/search should return matching entities with attribution headers', async () => {
    const res = await supertest(app.server).get('/v1/search?q=Apollo');
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.attribution).toBeDefined();
  });

  it('GET /v1/route should return routing geometry and estimated duration', async () => {
    const res = await supertest(app.server).get('/v1/route?from=13.0827,80.2707&to=13.0607,80.2512');
    expect(res.status).toBe(200);
    expect(res.body.routes).toBeDefined();
    expect(res.body.routes.length).toBeGreaterThan(0);
  });
});
