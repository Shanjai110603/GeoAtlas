import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, findUserById } from '../services/auth';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /v1/auth/signup
  fastify.post('/v1/auth/signup', async (request: any, reply: any) => {
    const { email, password, display_name } = request.body as { email?: string; password?: string; display_name?: string };
    if (!email || !password || !display_name) {
      return reply.code(400).send({ error: 'Email, password, and display_name are required' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return reply.code(400).send({ error: 'User with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(email, hash, display_name, 'new');

    const token = fastify.jwt.sign({ id: user.id, email: user.email, trust_tier: user.trust_tier });
    return reply.code(201).send({ user, token });
  });

  // POST /v1/auth/login
  fastify.post('/v1/auth/login', async (request: any, reply: any) => {
    const { email, password } = request.body as { email?: string; password?: string };
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password_hash) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email, trust_tier: user.trust_tier });
    return {
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        trust_tier: user.trust_tier,
        accepted_edit_count: user.accepted_edit_count,
      },
      token,
    };
  });

  // GET /v1/auth/me
  fastify.get('/v1/auth/me', async (request: any, reply: any) => {
    const decoded = (request as any).user;
    if (!decoded) {
      return reply.code(401).send({ error: 'Not authenticated' });
    }

    const user = await findUserById(decoded.id);
    return { user };
  });
}
