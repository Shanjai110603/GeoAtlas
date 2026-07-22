import { FastifyInstance } from 'fastify';
import { query } from '../db';
import { generatePresignedUploadUrl } from '../services/storage';

export async function businessRoutes(fastify: FastifyInstance) {
  // GET /v1/business/:id
  fastify.get('/v1/business/:id', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };

    const bizRes = await query(
      `SELECT id, name, native_name, attributes, confidence_score, source,
              ST_AsGeoJSON(geom)::json AS geometry
       FROM entities
       WHERE id = $1 AND entity_type = 'business';`,
      [id]
    );

    if (bizRes.rows.length === 0) {
      return reply.code(404).send({ error: 'Business entity not found' });
    }

    const reviewsRes = await query(
      `SELECT r.id, r.rating, r.text, r.photos, r.created_at, u.display_name
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       WHERE r.entity_id = $1 AND r.status = 'approved'
       ORDER BY r.created_at DESC;`,
      [id]
    );

    return {
      business: bizRes.rows[0],
      reviews: reviewsRes.rows,
      attribution: '© OpenStreetMap contributors & GeoAtlas Business Directory (ODbL / CC-BY-SA)',
    };
  });

  // POST /v1/business/:id/reviews
  fastify.post('/v1/business/:id/reviews', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };
    const { rating, text, photos } = request.body as { rating: number; text: string; photos?: string[] };

    if (!rating || rating < 1 || rating > 5) {
      return reply.code(400).send({ error: 'Rating must be an integer between 1 and 5' });
    }

    const user = (request as any).user;
    const userId = user ? user.id : null;

    const res = await query(
      `INSERT INTO reviews (entity_id, user_id, rating, text, photos, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *;`,
      [id, userId, rating, text, JSON.stringify(photos || [])]
    );

    return reply.code(201).send({
      message: 'Review submitted and queued for moderation',
      review: res.rows[0],
    });
  });

  // POST /v1/business/:id/photos/presign - Generate presigned upload URL for MinIO
  fastify.post('/v1/business/:id/photos/presign', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };
    const { filename, content_type } = request.body as { filename: string; content_type: string };

    if (!filename || !content_type) {
      return reply.code(400).send({ error: 'Missing filename or content_type in request body' });
    }

    const { uploadUrl, fileUrl, key } = await generatePresignedUploadUrl(filename, content_type);

    return reply.code(200).send({
      message: 'Upload directly to this presigned URL. Photo will be moderation-gated until parent review/entity is approved.',
      upload_url: uploadUrl,
      file_url: fileUrl,
      object_key: key,
      entity_id: id,
      moderation_status: 'pending',
    });
  });
}
