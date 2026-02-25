import { getSessionUser, standardResponse } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  return standardResponse({ user });
}
