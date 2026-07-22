import supertest from 'supertest';
import { buildApp } from '../../services/api/src/index';

describe('Object Storage Upload → Moderation-Gated Serving Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /v1/business/:id/photos/presign should return a presigned upload URL with pending moderation status', async () => {
    const fakeEntityId = '00000000-0000-0000-0000-000000000001';
    const res = await supertest(app.server)
      .post(`/v1/business/${fakeEntityId}/photos/presign`)
      .send({ filename: 'storefront.jpg', content_type: 'image/jpeg' });

    expect(res.status).toBe(200);
    expect(res.body.upload_url).toBeDefined();
    expect(res.body.file_url).toBeDefined();
    expect(res.body.object_key).toContain('uploads/');
    expect(res.body.moderation_status).toBe('pending');
    expect(res.body.entity_id).toBe(fakeEntityId);
  });

  it('POST /v1/business/:id/photos/presign should reject requests without filename or content_type', async () => {
    const fakeEntityId = '00000000-0000-0000-0000-000000000001';
    const res = await supertest(app.server)
      .post(`/v1/business/${fakeEntityId}/photos/presign`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing');
  });

  it('POST /v1/business/:id/reviews should queue review with photos as pending — never publicly served unmoderated', async () => {
    const fakeEntityId = '00000000-0000-0000-0000-000000000001';
    const res = await supertest(app.server)
      .post(`/v1/business/${fakeEntityId}/reviews`)
      .send({
        rating: 4,
        text: 'Great place!',
        photos: ['uploads/1234-storefront.jpg'],
      });

    expect(res.status).toBe(201);
    expect(res.body.review.status).toBe('pending');
  });
});
