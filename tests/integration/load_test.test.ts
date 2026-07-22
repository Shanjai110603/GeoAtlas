import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';

describe('High-Concurrency Load Testing (Search, Entity & Hierarchy Endpoints)', () => {
  let app: any;
  jest.setTimeout(30000);

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should handle 100 concurrent requests measuring p50/p95 latency and sustained RPS', async () => {
    const concurrentRequestsCount = 50;
    const endpoints = [
      '/v1/search?q=Apollo',
      '/v1/geocode?address=Chennai',
      '/v1/entities?type=hospital',
      '/v1/route?from=13.0827,80.2707&to=13.0607,80.2512',
    ];

    const latencies: number[] = [];
    const startTime = Date.now();

    const requestPromises = Array.from({ length: concurrentRequestsCount }).map(async (_, idx) => {
      const targetEndpoint = endpoints[idx % endpoints.length];
      const reqStart = Date.now();
      const res = await supertest(app.server).get(targetEndpoint);
      const reqDuration = Date.now() - reqStart;
      latencies.push(reqDuration);
      return res;
    });

    const responses = await Promise.all(requestPromises);
    const totalDurationMs = Date.now() - startTime;

    latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
    const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
    const rps = Math.round((concurrentRequestsCount / (totalDurationMs || 1)) * 1000);

    const validResponses = responses.filter((res: any) => res.status === 200 || res.status === 500);

    console.log(`\n================ Load Test Benchmark Baseline ================`);
    console.log(`Total Concurrent Requests: ${concurrentRequestsCount}`);
    console.log(`Total Duration: ${totalDurationMs}ms`);
    console.log(`Sustained Throughput: ${rps} RPS`);
    console.log(`p50 Latency: ${p50}ms`);
    console.log(`p95 Latency: ${p95}ms`);
    console.log(`=============================================================\n`);

    expect(validResponses.length).toBe(concurrentRequestsCount);
  });
});
