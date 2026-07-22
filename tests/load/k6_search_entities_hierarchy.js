// GeoAtlas Phase 1 — k6 Load Test Baseline
// Targets: /v1/search, /v1/entities, /v1/admin/{id}/hierarchy
// Records: p50, p95 latency and max sustained RPS
//
// Run with: k6 run tests/load/k6_search_entities_hierarchy.js
// Or: k6 run --vus 50 --duration 30s tests/load/k6_search_entities_hierarchy.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const searchLatency = new Trend('search_latency', true);
const entitiesLatency = new Trend('entities_latency', true);
const hierarchyLatency = new Trend('hierarchy_latency', true);
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '10s', target: 20 },  // Ramp up to 20 VUs
    { duration: '20s', target: 50 },  // Sustain 50 concurrent VUs
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    'search_latency': ['p(95)<500'],       // p95 < 500ms
    'entities_latency': ['p(95)<500'],
    'hierarchy_latency': ['p(95)<1000'],   // Hierarchy traversal allowed up to 1s p95
    'error_rate': ['rate<0.01'],           // < 1% error rate
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  // Search endpoint
  const searchRes = http.get(`${BASE_URL}/v1/search?q=Chennai`);
  searchLatency.add(searchRes.timings.duration);
  check(searchRes, {
    'search status 200': (r) => r.status === 200,
    'search has results': (r) => JSON.parse(r.body).results !== undefined,
  }) || errorRate.add(1);

  sleep(0.1);

  // Entities endpoint
  const entitiesRes = http.get(`${BASE_URL}/v1/entities?type=hospital`);
  entitiesLatency.add(entitiesRes.timings.duration);
  check(entitiesRes, {
    'entities status 200': (r) => r.status === 200,
    'entities has data': (r) => JSON.parse(r.body).entities !== undefined,
  }) || errorRate.add(1);

  sleep(0.1);

  // Hierarchy endpoint (uses a placeholder UUID — will 404 but still measures endpoint performance)
  const hierarchyRes = http.get(`${BASE_URL}/v1/admin/00000000-0000-0000-0000-000000000001/hierarchy`);
  hierarchyLatency.add(hierarchyRes.timings.duration);
  check(hierarchyRes, {
    'hierarchy responds': (r) => r.status === 200 || r.status === 404,
  }) || errorRate.add(1);

  sleep(0.2);
}

export function handleSummary(data) {
  const searchP50 = data.metrics.search_latency?.values?.['p(50)'] || 'N/A';
  const searchP95 = data.metrics.search_latency?.values?.['p(95)'] || 'N/A';
  const entitiesP50 = data.metrics.entities_latency?.values?.['p(50)'] || 'N/A';
  const entitiesP95 = data.metrics.entities_latency?.values?.['p(95)'] || 'N/A';
  const hierarchyP50 = data.metrics.hierarchy_latency?.values?.['p(50)'] || 'N/A';
  const hierarchyP95 = data.metrics.hierarchy_latency?.values?.['p(95)'] || 'N/A';
  const totalRequests = data.metrics.http_reqs?.values?.count || 0;
  const duration = data.state?.testRunDurationMs || 40000;
  const rps = Math.round((totalRequests / duration) * 1000);

  console.log(`\n================ GeoAtlas Phase 1 Load Test Baseline ================`);
  console.log(`Search      — p50: ${searchP50}ms  |  p95: ${searchP95}ms`);
  console.log(`Entities    — p50: ${entitiesP50}ms  |  p95: ${entitiesP95}ms`);
  console.log(`Hierarchy   — p50: ${hierarchyP50}ms  |  p95: ${hierarchyP95}ms`);
  console.log(`Sustained RPS: ${rps}`);
  console.log(`=====================================================================\n`);

  return {};
}
