import { NextRequest } from 'next/server';
import { standardError, standardResponse } from '@/lib/auth';
import { runDailyForAllUsers } from '@/services/daily-run';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get('authorization');
  if (!secret || header !== `Bearer ${secret}`) {
    return standardError('UNAUTHORIZED', 'Cron secret is missing or does not match', 401);
  }
  try {
    const result = await runDailyForAllUsers();
    return standardResponse(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Daily run failed';
    return standardError('CRON_FAILED', message, 500);
  }
}
