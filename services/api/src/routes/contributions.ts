import { FastifyInstance } from 'fastify';
import { submitContribution, reviewContribution } from '../services/moderation';
import { query } from '../db';

export async function contributionRoutes(fastify: FastifyInstance) {
  // POST /v1/contributions - Submit edit/creation
  fastify.post('/v1/contributions', async (request, reply) => {
    const { target_table, target_id, diff, source } = request.body as {
      target_table: string;
      target_id?: string;
      diff: any;
      source?: string;
    };

    if (!target_table || !diff) {
      return reply.code(400).send({ error: 'Missing target_table or diff body' });
    }

    const user = (request as any).user;
    const editorId = user ? user.id : null;

    const contribution = await submitContribution(editorId, target_table, target_id || null, diff, source);
    return reply.code(201).send({
      message: contribution.status === 'approved' ? 'Contribution auto-approved and applied' : 'Contribution queued for moderation',
      contribution,
    });
  });

  // GET /v1/contributions/:id/status
  fastify.get('/v1/contributions/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };

    const res = await query(`SELECT * FROM edit_history WHERE id = $1;`, [id]);
    if (res.rows.length === 0) {
      return reply.code(404).send({ error: 'Contribution record not found' });
    }

    return { contribution: res.rows[0] };
  });

  // POST /v1/contributions/:id/review - Moderator approval/rejection
  fastify.post('/v1/contributions/:id/review', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { action } = request.body as { action: 'approve' | 'reject' };

    if (!['approve', 'reject'].includes(action)) {
      return reply.code(400).send({ error: 'Action must be "approve" or "reject"' });
    }

    const user = (request as any).user;
    const moderatorId = user ? user.id : '00000000-0000-0000-0000-000000000001'; // Default system moderator if testing

    try {
      const reviewed = await reviewContribution(id, moderatorId, action);
      return { message: `Contribution successfully ${action}d`, contribution: reviewed };
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  });
}
