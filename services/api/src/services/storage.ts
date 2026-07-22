import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { config } from '../config';

export const s3Client = new S3Client({
  endpoint: config.storage.endpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.storage.accessKey,
    secretAccessKey: config.storage.secretKey,
  },
  forcePathStyle: true, // Needed for MinIO
});

export async function ensureBucketExists(): Promise<void> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: config.storage.bucket }));
  } catch (err: any) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      await s3Client.send(new CreateBucketCommand({ Bucket: config.storage.bucket }));
    }
  }
}

export async function uploadImage(filename: string, body: Buffer, contentType: string): Promise<string> {
  await ensureBucketExists();
  const key = `uploads/${Date.now()}-${filename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${config.storage.endpoint}/${config.storage.bucket}/${key}`;
}
