'use server';

import { registerServerSide } from '@services/authServerService';
import { RegisterRequest } from '@models/user';
import type { RegisterFormState } from '@components/pages/RegisterForm';

export async function handleRegister(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const email = formData.get('email');
  const password = formData.get('password');
  const repeatedPassword = formData.get('repeatedPassword');
  const name = formData.get('name');
  const lastName = formData.get('lastName');
  const specialDiet = formData.getAll('specialDiet');

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof repeatedPassword !== 'string' ||
    typeof name !== 'string' ||
    typeof lastName !== 'string'
  ) {
    return { error: 'registerFailed' };
  }

  if (password !== repeatedPassword) {
    return { error: 'passwordMismatch' };
  }

  try {
    const payload: RegisterRequest = {
      email: email,
      password: password,
      name: name,
      lastName: lastName,
      specialDiet: specialDiet as string[],
    };

    const response = await registerServerSide(payload);
    if (response && response._id) {
      return { success: true };
    } else {
      return { error: 'registerFailed' };
    }
  } catch (err) {
    console.error('Registration failed', err);
    return { error: 'registerFailed' };
  }
}
