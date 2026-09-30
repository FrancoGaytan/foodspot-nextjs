import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleLogout } from '../src/app/[lang]/logout/actions';

const { clearAuthCookies } = vi.hoisted(() => ({
  clearAuthCookies: vi.fn(),
}));

vi.mock('@utils/cookies/localeCookiesServer', () => ({
  clearAuthCookies,
}));

describe('handleLogout', () => {
  beforeEach(() => {
    clearAuthCookies.mockReset();
  });

  it('clears the authenticated session cookies', async () => {
    await expect(handleLogout()).resolves.toBeUndefined();
    expect(clearAuthCookies).toHaveBeenCalledOnce();
  });
});
