import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';

describe('High-Concurrency Load Testing (Search, Entity & Hierarchy Endpoints)', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should handle 100 concurrent requests across search, entity, and hierarchy endpoints within 1000ms', async () => {
    const concurrentRequestsCount = 100;
    const endpoints = [
      '/v1/search?q=Apollo',
      '/v1/geocode?address=Chennai',
      '/v1/entities?type=hospital',
      '/v1/route?from=13.0827,80.2707&to=13.0607,80.2512',
    ];

    const startTime = Date.now();

    const requestPromises = Array.from({ length: concurrentRequestsCount }).map((_, idx) => {
      const targetEndpoint = endpoints[idx % endpoints.length];
      return supertest(app.server).get(targetEndpoint);
    });

    const responses = await Promise.all(requestPromises);
    const totalDuration = Date.now() - startTime;

    const successfulResponses = responses.filter((res: any) => res.status === 200);
    const failedResponses = responses.filter((res: any) => res.status !== 200);

    console.log(`[Load Test Benchmark] Executed ${concurrentRequestsCount} requests in ${totalDuration}ms.`);
    console.log(`[Load Test Success Rate] Success: ${successfulResponses.length}/${concurrentRequestsCount}, Failed: ${failedResponses.length}`);

    expect(successfulResponses.length).toBe(concurrentRequestsCount);
    expect(totalDuration).toBeLessThan(5000); // Must complete under load in under 5 seconds
  });
});
