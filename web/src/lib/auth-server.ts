import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import { UserSession } from './types';

export async function getServerSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('geoatlas_jwt')?.value;
    if (!token) return null;

    const payload = decodeJwt(token) as any;
    if (!payload || !payload.id) return null;

    return {
      id: payload.id,
      email: payload.email,
      display_name: payload.display_name || payload.email.split('@')[0],
      trust_tier: payload.trust_tier || 'new',
      accepted_edit_count: payload.accepted_edit_count || 0,
    };
  } catch (_) {
    return null;
  }
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function isModerator(): Promise<boolean> {
  const session = await getServerSession();
  if (!session) return false;
  return ['moderator', 'official'].includes(session.trust_tier);
}
