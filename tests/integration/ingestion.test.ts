import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';

describe('Data Ingestion Pipeline Idempotency & Attribution Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /v1/search results should include attribution field for OSM/Wikidata sources', async () => {
    const res = await supertest(app.server).get('/v1/search?q=hospital');
    expect(res.status).toBe(200);
    expect(res.body.attribution).toBeDefined();
    expect(res.body.attribution).toContain('OpenStreetMap');
  });

  it('GET /v1/entities results should carry source and attribution metadata', async () => {
    const res = await supertest(app.server).get('/v1/entities?type=hospital');
    expect(res.status).toBe(200);
    expect(res.body.attribution).toBeDefined();
  });

  it('All API responses should include X-GeoAtlas-Attribution header', async () => {
    const res = await supertest(app.server).get('/v1/search?q=Chennai');
    expect(res.status).toBe(200);
    expect(res.headers['x-geoatlas-attribution']).toBeDefined();
    expect(res.headers['x-geoatlas-attribution']).toContain('OpenStreetMap');
  });

  it('GET /v1/geocode response should include Nominatim ODbL attribution', async () => {
    const res = await supertest(app.server).get('/v1/geocode?address=Chennai');
    expect(res.status).toBe(200);
    expect(res.body.attribution).toContain('ODbL');
  });
});
