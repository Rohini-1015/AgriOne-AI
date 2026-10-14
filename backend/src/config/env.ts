import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/agrione?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'agrione_super_secret_jwt_key_development_2026_safe_seed',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  UPLOAD_DIR: path.resolve(__dirname, '../../uploads'),
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
  PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || 'MOCK_MERCHANT_ID',
  PHONEPE_SALT_KEY: process.env.PHONEPE_SALT_KEY || 'MOCK_SALT_KEY',
  PHONEPE_SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  PHONEPE_BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  PAYMENT_MODE: process.env.PAYMENT_MODE || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
