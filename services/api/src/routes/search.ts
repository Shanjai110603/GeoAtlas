import { FastifyInstance } from 'fastify';
import { searchGeoAtlas } from '../services/search';

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/search', async (request: any, reply: any) => {
    const { q, type, bbox } = request.query as { q?: string; type?: string; bbox?: string };
    if (!q) {
      return reply.code(400).send({ error: 'Missing required search query parameter "q"' });
    }

    const hits = await searchGeoAtlas(q, type, bbox);
    return {
      query: q,
      results: hits,
      attribution: '© OpenStreetMap contributors & GeoAtlas Community (ODbL / CC-BY-SA)',
    };
  });
}
