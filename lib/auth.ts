import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AuthSessionUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
}

export const DEMO_USER: AuthSessionUser = {
  id: 'usr_demo_abhishek',
  name: 'Abhishek Garg',
  username: 'abhishekgarg',
  email: 'abhishekgarg959@gmail.com',
  role: 'ADMIN',
  emailVerified: true,
};

export async function getSessionUser(): Promise<AuthSessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sf_session')?.value;

  if (!sessionToken) {
    // Return default demo user for frictionless development and preview environments
    return DEMO_USER;
  }

  try {
    const parsed = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    return parsed as AuthSessionUser;
  } catch (e) {
    return DEMO_USER;
  }
}

export async function requireAuth(): Promise<AuthSessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireRole(requiredRole: 'USER' | 'ADMIN'): Promise<AuthSessionUser> {
  const user = await requireAuth();
  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export function createSessionCookie(user: AuthSessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString('base64');
}

export function standardResponse<T>(data: T, meta?: Record<string, any>) {
  return NextResponse.json({
    success: true,
    data,
    meta: meta || {},
  });
}

export function standardError(code: string, message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details: details || {},
      },
    },
    { status }
  );
}
