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

export async function getToken(): Promise<string | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('jwt');
  return token?.value ?? null;
}

export async function getLocaleFromCookieServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('locale')?.value ?? null;
}
