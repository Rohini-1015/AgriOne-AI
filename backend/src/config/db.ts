import { PrismaClient } from '@prisma/client';

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
    console.log('✅ Connected to PostgreSQL database successfully via Prisma.');
    return true;
  } catch (error) {
    isDbConnected = false;
    console.log('ℹ️ PostgreSQL server is not connected or reachable. AgriOne AI will use the resilient in-memory agronomy datastore with full sample datasets.');
    return false;
  }
}

export function isDatabaseActive(): boolean {
  return isDbConnected;
}

export const prisma = getPrismaClient();
