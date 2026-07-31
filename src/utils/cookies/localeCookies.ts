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
