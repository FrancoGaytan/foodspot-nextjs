import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginServerSide, registerServerSide } from '../src/services/authServerService';
import { forgotPassword, recoverPassword, verifyCode } from '../src/services/passwordServerService';

const { postServer, putServer } = vi.hoisted(() => ({
  postServer: vi.fn(),
  putServer: vi.fn(),
}));

vi.mock('../src/services/httpServer', () => ({
  postServer,
  putServer,
}));

describe('authentication service contracts', () => {
  beforeEach(() => {
    postServer.mockReset();
    putServer.mockReset();
  });

  it('sends login credentials to the login endpoint', async () => {
    const payload = { email: 'user@endava.com', password: 'Password1!' };
    const response = { id: 'user-1', name: 'User', jwt: 'jwt-token' };
    postServer.mockResolvedValue(response);

    await expect(loginServerSide(payload)).resolves.toEqual(response);
    expect(postServer).toHaveBeenCalledWith('/login/', payload);
  });

  it('sends registration data to the registration endpoint', async () => {
    const payload = { name: 'User', lastName: 'Example', email: 'user@endava.com', password: 'Password1!', specialDiet: [] };
    const response = { _id: 'user-1' };
    postServer.mockResolvedValue(response);

    await expect(registerServerSide(payload)).resolves.toEqual(response);
    expect(postServer).toHaveBeenCalledWith('/users/register/', payload);
  });

  it('sends password recovery requests with their cancellation signal', async () => {
    const payload = { email: 'user@endava.com' };
    const signal = new AbortController().signal;
    postServer.mockResolvedValue({});

    await forgotPassword(payload, signal);
    expect(postServer).toHaveBeenCalledWith('/password/forgot', payload, signal);
  });

  it('verifies password reset codes through the verification endpoint', async () => {
    const payload = { email: 'user@endava.com', verificationCode: '123456' };
    const signal = new AbortController().signal;
    putServer.mockResolvedValue(true);

    await expect(verifyCode(payload, signal)).resolves.toBe(true);
    expect(putServer).toHaveBeenCalledWith('/password/verifyCode', payload, signal);
  });

  it('updates passwords through the recovery endpoint', async () => {
    const payload = { email: 'user@endava.com', verificationCode: '123456', password: 'Password1!' };
    const signal = new AbortController().signal;
    putServer.mockResolvedValue({});

    await recoverPassword(payload, signal);
    expect(putServer).toHaveBeenCalledWith('/password/recover', payload, signal);
  });
});
