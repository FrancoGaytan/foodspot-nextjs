import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ServerHttpError } from '../src/services/httpServer';
import { handleLogin } from '../src/app/[lang]/(auth)/login/actions';

const { loginServerSide, setAuthCookies } = vi.hoisted(() => ({
  loginServerSide: vi.fn(),
  setAuthCookies: vi.fn(),
}));

vi.mock('@services/authServerService', () => ({
  loginServerSide,
}));

vi.mock('@utils/cookies/localeCookiesServer', () => ({
  setAuthCookies,
}));

function createFormData(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  formData.set('email', 'user@endava.com');
  formData.set('password', 'Password1!');
  formData.set('lang', 'en-US');

  Object.entries(overrides).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe('handleLogin', () => {
  beforeEach(() => {
    loginServerSide.mockReset();
    setAuthCookies.mockReset();
  });

  it('rejects incomplete credentials before calling the service', async () => {
    await expect(handleLogin({ error: '' }, createFormData({ password: '' }))).resolves.toEqual({ error: 'loginFailed' });
    expect(loginServerSide).not.toHaveBeenCalled();
  });

  it('returns invalid credentials when the service does not provide a token', async () => {
    loginServerSide.mockResolvedValue({ id: 'user-1', name: 'User', jwt: '' });

    await expect(handleLogin({ error: '' }, createFormData())).resolves.toEqual({ error: 'invalidCredentials' });
    expect(setAuthCookies).not.toHaveBeenCalled();
  });

  it('persists authentication cookies after a successful login', async () => {
    loginServerSide.mockResolvedValue({ id: 'user-1', name: 'User', jwt: 'jwt-token' });

    await expect(handleLogin({ error: '' }, createFormData())).resolves.toEqual({ success: true });
    expect(loginServerSide).toHaveBeenCalledWith({ email: 'user@endava.com', password: 'Password1!' });
    expect(setAuthCookies).toHaveBeenCalledWith('jwt-token', { id: 'user-1', name: 'User' });
  });

  it('maps a rejected login request to invalid credentials', async () => {
    loginServerSide.mockRejectedValue(new ServerHttpError('POST', '/login/', 400));

    await expect(handleLogin({ error: '' }, createFormData())).resolves.toEqual({ error: 'invalidCredentials' });
  });

  it('maps unexpected service errors to a safe login failure', async () => {
    loginServerSide.mockRejectedValue(new Error('Network unavailable'));

    await expect(handleLogin({ error: '' }, createFormData())).resolves.toEqual({ error: 'loginFailed' });
  });
});
