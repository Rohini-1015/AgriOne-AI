import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../utils/seed';

let prismaInstance: PrismaClient | null = null;
let isDbConnected = false;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: ['error', 'warn'],
    });
  }
  return prismaInstance;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    console.log('✅ Connected to SQLite database successfully via Prisma (dev.db).');
    await seedDatabase();
    return true;
  } catch (error) {
    isDbConnected = false;
    console.log('ℹ️ SQLite database error. AgriOne AI will use in-memory datastore fallback.', error);
    return false;
  }
}

export function isDatabaseActive(): boolean {
  return isDbConnected;
}

export const prisma = getPrismaClient();
