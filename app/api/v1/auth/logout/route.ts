import { cookies } from 'next/headers';
import { standardResponse } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('sf_session');
  return standardResponse({ message: 'Logged out successfully' });
}
