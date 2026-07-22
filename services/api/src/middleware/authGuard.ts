import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function authGuard(fastify: FastifyInstance) {
  fastify.decorate('requireAuth', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user || !user.id) {
      return reply.code(401).send({ error: 'Authentication required' });
    }
  });

  fastify.decorate('requireModerator', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user || !['moderator', 'official'].includes(user.trust_tier)) {
      return reply.code(403).send({ error: 'Moderator or official access required' });
    }
  });
}
