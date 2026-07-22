import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';

export const s3Client = new S3Client({
  endpoint: config.storage.endpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.storage.accessKey,
    secretAccessKey: config.storage.secretKey,
  },
  forcePathStyle: true, // MinIO requirement
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

export async function generatePresignedUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  await ensureBucketExists();
  const key = `uploads/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: config.storage.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const fileUrl = `${config.storage.endpoint}/${config.storage.bucket}/${key}`;

  return { uploadUrl, fileUrl, key };
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
