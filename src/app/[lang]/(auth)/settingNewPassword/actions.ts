'use server';

import type { SettingNewPasswordFormState } from '@components/pages/SettingNewPasswordForm';
import { recoverPassword, verifyCode } from '@services/passwordServerService';
import { validatePassword } from '@utils/utilities';

export async function handleSetNewPassword(_prevState: SettingNewPasswordFormState, formData: FormData): Promise<SettingNewPasswordFormState> {
  const email = formData.get('email');
  const verificationCode = formData.get('verificationCode');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (typeof email !== 'string' || typeof verificationCode !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
    return { error: 'missingFields' };
  }

  if (!validatePassword(password)) {
    return { error: 'invalidPassword' };
  }

  if (password !== confirmPassword) {
    return { error: 'passwordMismatch' };
  }

  try {
    const isCodeValid = await verifyCode({ email, verificationCode: verificationCode });

    if (!isCodeValid) {
      return { error: 'invalidVerificationCode' };
    }

    await recoverPassword({ email, verificationCode, password });

    return { success: true };
  } catch (err) {
    console.error('Error en updatePassword', err);
    return { error: 'updateFailed' };
  }
}
