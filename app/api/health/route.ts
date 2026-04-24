import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';
  let dbError: string | null = null;
  const hasDbUrl = !!process.env.DATABASE_URL;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: dbStatus,
      dbError,
      hasDbUrl,
    },
    { status: 200 }
  );
}
