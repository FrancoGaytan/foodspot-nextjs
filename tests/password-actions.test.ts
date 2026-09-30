import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleRecoverKey } from '../src/app/[lang]/(auth)/recoverKey/actions';
import { handleSetNewPassword } from '../src/app/[lang]/(auth)/settingNewPassword/actions';

const { forgotPassword, recoverPassword, verifyCode } = vi.hoisted(() => ({
  forgotPassword: vi.fn(),
  recoverPassword: vi.fn(),
  verifyCode: vi.fn(),
}));

vi.mock('@services/passwordServerService', () => ({
  forgotPassword,
  recoverPassword,
  verifyCode,
}));

function createRecoverKeyFormData(email = 'user@endava.com'): FormData {
  const formData = new FormData();
  formData.set('email', email);
  return formData;
}

function createResetPasswordFormData(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  formData.set('email', 'user@endava.com');
  formData.set('verificationCode', '123456');
  formData.set('password', 'Password1!');
  formData.set('confirmPassword', 'Password1!');

  Object.entries(overrides).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe('password recovery actions', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  beforeEach(() => {
    forgotPassword.mockReset();
    recoverPassword.mockReset();
    verifyCode.mockReset();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  it('rejects an empty recovery email before calling the service', async () => {
    await expect(handleRecoverKey({ error: '' }, createRecoverKeyFormData(''))).resolves.toEqual({ error: 'wrongDataEntered' });
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it('requests a recovery key for a valid email', async () => {
    forgotPassword.mockResolvedValue(undefined);

    await expect(handleRecoverKey({ error: '' }, createRecoverKeyFormData())).resolves.toEqual({ success: true });
    expect(forgotPassword).toHaveBeenCalledWith({ email: 'user@endava.com' });
  });

  it('maps recovery service failures to the form error state', async () => {
    forgotPassword.mockRejectedValue(new Error('Network unavailable'));

    await expect(handleRecoverKey({ error: '' }, createRecoverKeyFormData())).resolves.toEqual({ error: 'noMatchingMail' });
  });

  it('rejects a reset with missing fields before calling services', async () => {
    const formData = createResetPasswordFormData();
    formData.delete('verificationCode');

    await expect(handleSetNewPassword({ error: '' }, formData)).resolves.toEqual({ error: 'missingFields' });
    expect(verifyCode).not.toHaveBeenCalled();
    expect(recoverPassword).not.toHaveBeenCalled();
  });

  it('rejects passwords that do not satisfy the password policy', async () => {
    await expect(handleSetNewPassword({ error: '' }, createResetPasswordFormData({ password: 'password' }))).resolves.toEqual({
      error: 'invalidPassword',
    });
    expect(verifyCode).not.toHaveBeenCalled();
  });

  it('rejects a reset when password confirmation differs', async () => {
    await expect(handleSetNewPassword({ error: '' }, createResetPasswordFormData({ confirmPassword: 'OtherPassword1!' }))).resolves.toEqual({
      error: 'passwordMismatch',
    });
    expect(verifyCode).not.toHaveBeenCalled();
  });

  it('stops a reset when the verification code is invalid', async () => {
    verifyCode.mockResolvedValue(false);

    await expect(handleSetNewPassword({ error: '' }, createResetPasswordFormData())).resolves.toEqual({ error: 'invalidVerificationCode' });
    expect(verifyCode).toHaveBeenCalledWith({ email: 'user@endava.com', verificationCode: '123456' });
    expect(recoverPassword).not.toHaveBeenCalled();
  });

  it('resets the password after a valid verification code', async () => {
    verifyCode.mockResolvedValue(true);
    recoverPassword.mockResolvedValue(undefined);

    await expect(handleSetNewPassword({ error: '' }, createResetPasswordFormData())).resolves.toEqual({ success: true });
    expect(recoverPassword).toHaveBeenCalledWith({ email: 'user@endava.com', verificationCode: '123456', password: 'Password1!' });
  });

  it('maps verification and update failures to a safe form error', async () => {
    verifyCode.mockRejectedValue(new Error('Network unavailable'));

    await expect(handleSetNewPassword({ error: '' }, createResetPasswordFormData())).resolves.toEqual({ error: 'updateFailed' });
  });
});
