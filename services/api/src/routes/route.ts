import { FastifyInstance } from 'fastify';
import { calculateRoute } from '../services/gis';

export async function routeRoutes(fastify: FastifyInstance) {
  // GET /v1/route?from=lat,lng&to=lat,lng&mode=driving
  fastify.get('/v1/route', async (request: any, reply: any) => {
    const { from, to, mode } = request.query as { from?: string; to?: string; mode?: string };
    if (!from || !to) {
      return reply.code(400).send({ error: 'Missing required query parameters "from" and "to" (lat,lng format)' });
    }

    const [fromLat, fromLng] = from.split(',').map((s) => parseFloat(s.trim()));
    const [toLat, toLng] = to.split(',').map((s) => parseFloat(s.trim()));

    const result = await calculateRoute(fromLat, fromLng, toLat, toLng, mode || 'driving');
    return result;
  });
}
