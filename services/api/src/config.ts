import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'geoatlas_secret_key',
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'geoatlas',
    password: process.env.POSTGRES_PASSWORD || 'geoatlas_secret',
    database: process.env.POSTGRES_DB || 'geoatlas',
  },
  meili: {
    host: process.env.MEILI_HOST || 'http://localhost:7700',
    apiKey: process.env.MEILI_MASTER_KEY || 'geoatlas_meili_master_key',
  },
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || 'http://localhost:9000',
    accessKey: process.env.STORAGE_ACCESS_KEY || 'geoatlas_minio',
    secretKey: process.env.STORAGE_SECRET_KEY || 'geoatlas_minio_secret',
    bucket: process.env.STORAGE_BUCKET || 'geoatlas-media',
  },
  nominatimUrl: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org',
  osrmUrl: process.env.OSRM_URL || 'http://localhost:5000',
};
