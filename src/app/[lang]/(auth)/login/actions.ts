'use server';

import { loginServerSide } from '@services/authServerService';
import { LoginRequest } from '@models/user';
import type { LoginFormState } from '@components/Modules/LoginForm';
import { setAuthCookies } from '@utils/cookies/localeCookiesServer';
import { ServerHttpError } from '@services/httpServer';

export async function handleLogin(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const lang = formData.get('lang') as string;

  if (!email || !password || !lang) {
    return { error: 'loginFailed' };
  }

  try {
    const payload: LoginRequest = { email, password };
    const { jwt, id, name } = await loginServerSide(payload);

    if (!jwt) return { error: 'invalidCredentials' };

    await setAuthCookies(jwt, { id, name });

    return { success: true };
  } catch (err) {
    if (err instanceof ServerHttpError && err.status === 400) {
      return { error: 'invalidCredentials' };
    }

    console.log('Login failed:', err);
    return { error: 'loginFailed' };
  }
}
