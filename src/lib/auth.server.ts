import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { AuthUser } from './auth';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function createToken(user: AuthUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
