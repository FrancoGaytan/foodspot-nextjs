import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleRegister } from '../src/app/[lang]/(auth)/register/actions';

const { registerServerSide } = vi.hoisted(() => ({
  registerServerSide: vi.fn(),
}));

vi.mock('@services/authServerService', () => ({
  registerServerSide,
}));

describe('handleRegister', () => {
  beforeEach(() => {
    registerServerSide.mockReset();
  });

  it('rejects passwords that do not match', async () => {
    const formData = new FormData();
    formData.set('email', 'user@endava.com');
    formData.set('password', 'Password1!');
    formData.set('repeatedPassword', 'Different1!');
    formData.set('name', 'User');
    formData.set('lastName', 'Example');

    await expect(handleRegister({ error: '' }, formData)).resolves.toEqual({ error: 'passwordMismatch' });
    expect(registerServerSide).not.toHaveBeenCalled();
  });

  it('rejects emails outside the allowed domain', async () => {
    const formData = new FormData();
    formData.set('email', 'user@example.com');
    formData.set('password', 'Password1!');
    formData.set('repeatedPassword', 'Password1!');
    formData.set('name', 'User');
    formData.set('lastName', 'Example');

    await expect(handleRegister({ error: '' }, formData)).resolves.toEqual({ error: 'invalidEmailDomain' });
    expect(registerServerSide).not.toHaveBeenCalled();
  });

  it('registers a valid user', async () => {
    registerServerSide.mockResolvedValue({ _id: 'user-1' });

    const formData = new FormData();
    formData.set('email', 'user@endava.com');
    formData.set('password', 'Password1!');
    formData.set('repeatedPassword', 'Password1!');
    formData.set('name', 'User');
    formData.set('lastName', 'Example');
    formData.append('specialDiet', 'vegan');

    await expect(handleRegister({ error: '' }, formData)).resolves.toEqual({ success: true });
    expect(registerServerSide).toHaveBeenCalledWith({
      email: 'user@endava.com',
      password: 'Password1!',
      name: 'User',
      lastName: 'Example',
      specialDiet: ['vegan'],
    });
  });
});
