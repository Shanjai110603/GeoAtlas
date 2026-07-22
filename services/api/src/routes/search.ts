import { FastifyInstance } from 'fastify';
import { searchGeoAtlas } from '../services/search';

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/search', async (request: any, reply: any) => {
    const { q, type, bbox, limit, offset } = request.query as {
      q?: string;
      type?: string;
      bbox?: string;
      limit?: string;
      offset?: string;
    };

    if (!q) {
      return reply.code(400).send({ error: 'Missing required search query parameter "q"' });
    }

    const parsedLimit = parseInt(limit || '20', 10);
    const parsedOffset = parseInt(offset || '0', 10);

    const { hits, totalHits } = await searchGeoAtlas(q, type, bbox, parsedLimit, parsedOffset);

    return {
      query: q,
      results: hits,
      total_hits: totalHits,
      limit: parsedLimit,
      offset: parsedOffset,
      attribution: '© OpenStreetMap contributors & GeoAtlas Community (ODbL / CC-BY-SA)',
    };
  });
}
