import { cookies } from 'next/headers';
import { IUserFromCookie } from './localeCookies';

export async function getUserFromCookieServer(): Promise<IUserFromCookie | null> {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get('user');
  if (!cookie) return null;

  try {
    const parsed = JSON.parse(cookie.value);
    return { id: parsed.id, name: parsed.name };
  } catch (e) {
    console.error('Error parsing user cookie:', e);
    return null;
  }
}
