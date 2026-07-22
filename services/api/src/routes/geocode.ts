import { FastifyInstance } from 'fastify';
import { geocodeAddress, reverseGeocode } from '../services/geocoding';

export async function geocodeRoutes(fastify: FastifyInstance) {
  fastify.get('/v1/geocode', async (request, reply) => {
    const { address } = request.query as { address?: string };
    if (!address) {
      return reply.code(400).send({ error: 'Missing required query parameter "address"' });
    }

    const results = await geocodeAddress(address);
    return { results, attribution: '© OpenStreetMap contributors, Nominatim Geocoding (ODbL)' };
  });

  fastify.get('/v1/reverse-geocode', async (request, reply) => {
    const { lat, lng } = request.query as { lat?: string; lng?: string };
    if (!lat || !lng) {
      return reply.code(400).send({ error: 'Missing required query parameters "lat" and "lng"' });
    }

    const result = await reverseGeocode(parseFloat(lat), parseFloat(lng));
    return result;
  });
}
