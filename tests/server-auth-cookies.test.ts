import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_COOKIE_NAMES,
  clearAuthCookies,
  getLocaleFromCookieServer,
  getToken,
  getUserFromCookieServer,
  setAuthCookies,
} from '../src/utils/cookies/localeCookiesServer';

const { cookieStore, cookies } = vi.hoisted(() => {
  const cookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };

  return {
    cookieStore,
    cookies: vi.fn(async () => cookieStore),
  };
});

vi.mock('next/headers', () => ({
  cookies,
}));

describe('server authentication cookies', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  beforeEach(() => {
    cookies.mockClear();
    cookieStore.get.mockReset();
    cookieStore.set.mockReset();
    cookieStore.delete.mockReset();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  it('reads an encoded authenticated user cookie', async () => {
    cookieStore.get.mockReturnValue({ value: encodeURIComponent(JSON.stringify({ id: 'user-1', name: 'User' })) });

    await expect(getUserFromCookieServer()).resolves.toEqual({ id: 'user-1', name: 'User' });
    expect(cookieStore.get).toHaveBeenCalledWith(AUTH_COOKIE_NAMES.user);
  });

  it('accepts a legacy unencoded user cookie', async () => {
    cookieStore.get.mockReturnValue({ value: JSON.stringify({ id: 'user-1', name: 'User' }) });

    await expect(getUserFromCookieServer()).resolves.toEqual({ id: 'user-1', name: 'User' });
  });

  it('returns null for missing, malformed, or incomplete user cookies', async () => {
    cookieStore.get.mockReturnValueOnce(undefined).mockReturnValueOnce({ value: 'not-json' }).mockReturnValueOnce({ value: '{}' });

    await expect(getUserFromCookieServer()).resolves.toBeNull();
    await expect(getUserFromCookieServer()).resolves.toBeNull();
    await expect(getUserFromCookieServer()).resolves.toBeNull();
  });

  it('reads token and locale values when available', async () => {
    cookieStore.get.mockImplementation((name: string) => {
      if (name === AUTH_COOKIE_NAMES.token) return { value: 'jwt-token' };
      if (name === 'locale') return { value: 'es-AR' };
      return undefined;
    });

    await expect(getToken()).resolves.toBe('jwt-token');
    await expect(getLocaleFromCookieServer()).resolves.toBe('es-AR');
  });

  it('stores JWT and user cookies with secure server-only options', async () => {
    await setAuthCookies('jwt-token', { id: 'user-1', name: 'User' });

    expect(cookieStore.set).toHaveBeenCalledWith(
      AUTH_COOKIE_NAMES.token,
      'jwt-token',
      expect.objectContaining({ path: '/', sameSite: 'lax', maxAge: 86400, httpOnly: true })
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      AUTH_COOKIE_NAMES.user,
      encodeURIComponent(JSON.stringify({ id: 'user-1', name: 'User' })),
      expect.objectContaining({ path: '/', sameSite: 'lax', maxAge: 86400, httpOnly: true })
    );
  });

  it('clears both authentication cookies during logout', async () => {
    await clearAuthCookies();

    expect(cookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIE_NAMES.token);
    expect(cookieStore.delete).toHaveBeenCalledWith(AUTH_COOKIE_NAMES.user);
  });
});
