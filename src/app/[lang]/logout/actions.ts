'use server';

import { clearAuthCookies } from '@utils/cookies/localeCookiesServer';

export async function handleLogout(): Promise<void> {
  await clearAuthCookies();
}