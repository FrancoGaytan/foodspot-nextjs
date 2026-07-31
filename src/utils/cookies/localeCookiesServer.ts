import { cookies } from 'next/headers';
import { IUserFromCookie } from './localeCookies';

export const AUTH_COOKIE_NAMES = {
  token: 'jwt',
  user: 'user',
} as const;

const AUTH_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24,
  secure: process.env.NODE_ENV === 'production',
};

export async function getUserFromCookieServer(): Promise<IUserFromCookie | null> {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get(AUTH_COOKIE_NAMES.user);
  if (!cookie) return null;

  try {
    let parsed: { id: string; name: string };

    try {
      parsed = JSON.parse(decodeURIComponent(cookie.value));
    } catch {
      parsed = JSON.parse(cookie.value);
    }

    if (!parsed.id || !parsed.name) return null;

    return { id: parsed.id, name: parsed.name };
  } catch (e) {
    console.error('Error parsing user cookie:', e);
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get(AUTH_COOKIE_NAMES.token);
  return token?.value ?? null;
}

export async function setAuthCookies(jwt: string, user: IUserFromCookie): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAMES.token, jwt, {
    ...AUTH_COOKIE_OPTIONS,
    httpOnly: true,
  });

  cookieStore.set(AUTH_COOKIE_NAMES.user, encodeURIComponent(JSON.stringify(user)), {
    ...AUTH_COOKIE_OPTIONS,
    httpOnly: false,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAMES.token);
  cookieStore.delete(AUTH_COOKIE_NAMES.user);
}

export async function getLocaleFromCookieServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('locale')?.value ?? null;
}
