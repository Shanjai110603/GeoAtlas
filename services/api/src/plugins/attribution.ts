import { FastifyInstance, FastifyReply } from 'fastify';

export async function attributionPlugin(fastify: FastifyInstance) {
  fastify.addHook('onSend', async (_request: any, reply: FastifyReply, payload: any) => {
    reply.header('X-GeoAtlas-Attribution', '© OpenStreetMap contributors (ODbL) / GeoNames (CC-BY) / Wikidata (CC0) / geoBoundaries (CC-BY)');
    return payload;
  });
}
