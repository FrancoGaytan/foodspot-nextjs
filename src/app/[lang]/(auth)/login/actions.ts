'use server';

import { cookies } from 'next/headers';
import { loginServerSide } from '@services/authServerService';
import { LoginRequest } from '@models/user';
import type { LoginFormState } from '@components/Modules/LoginForm';

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

    const cookieStore = await cookies();

    // Cookie visible por el cliente
    cookieStore.set('jwt', jwt, {
      httpOnly: false, //lo cambie porque necesito el token en todos los endpoints x tema de autorizacion del backend
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });

    // Cookie visible por el cliente
    cookieStore.set('user', JSON.stringify({ id, name }), {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });

    return { success: true };
  } catch (err) {
    console.log('Login failed:', err);
    return { error: 'loginFailed' };
  }
}
