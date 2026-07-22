import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';

import { config } from './config';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

import { searchRoutes } from './routes/search';
import { geocodeRoutes } from './routes/geocode';
import { adminRoutes } from './routes/admin';
import { entityRoutes } from './routes/entities';
import { compareRoutes } from './routes/compare';
import { businessRoutes } from './routes/business';
import { contributionRoutes } from './routes/contributions';
import { routeRoutes } from './routes/route';
import { authRoutes } from './routes/auth';
import { gisRoutes } from './routes/gis';
import { statisticsRoutes } from './routes/statistics';
import { attributionPlugin } from './plugins/attribution';

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'test' ? 'error' : 'info',
    },
  });

  // Plugins
  await fastify.register(cors, { origin: '*' });
  await fastify.register(helmet, { contentSecurityPolicy: false });
  await fastify.register(rateLimit, { max: 500, timeWindow: '1 minute' });
  await fastify.register(jwt, { secret: config.jwtSecret });
  await fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

  // Auth Decorator
  fastify.addHook('onRequest', async (request: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      // Allow unauthenticated requests to continue as anonymous user
    }
  });

  // Attribution plugin (adds licensing headers to all responses)
  await fastify.register(attributionPlugin);

  // REST Routes
  await fastify.register(searchRoutes);
  await fastify.register(geocodeRoutes);
  await fastify.register(adminRoutes);
  await fastify.register(entityRoutes);
  await fastify.register(compareRoutes);
  await fastify.register(businessRoutes);
  await fastify.register(contributionRoutes);
  await fastify.register(routeRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gisRoutes);
  await fastify.register(statisticsRoutes);

  // Apollo GraphQL Server Setup
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  await apolloServer.start();
  await fastify.register(fastifyApollo(apolloServer), {
    path: '/graphql',
  });

  return fastify;
}

if (process.env.NODE_ENV !== 'test') {
  buildApp().then((server: any) => {
    server.listen({ port: config.port, host: '0.0.0.0' }, (err: any, address: string) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`GeoAtlas Phase 1 API listening on ${address}`);
    });
  });
}
