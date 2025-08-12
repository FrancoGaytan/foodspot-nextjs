/**
 * Lee el valor de la cookie 'locale' si existe.
 */
export function getLocaleFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface IUserFromCookie {
  id: string;
  name: string;
}

/**
 * Lee el valor de la cookie 'user' si existe.
 */
export function getUserFromCookie(): IUserFromCookie | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/(?:^|; )user=([^;]*)/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));

    const user: IUserFromCookie = {
      id: parsed.id,
      name: parsed.name,
    };

    return user;
  } catch (e) {
    console.error('Error parsing user cookie:', e);
    return null;
  }
}
