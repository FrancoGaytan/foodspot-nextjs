import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

function createRequest(path: string, token?: string): NextRequest {
  const request = new NextRequest(`http://localhost${path}`);
  if (token) request.cookies.set('jwt', token);
  return request;
}

describe('middleware', () => {
  it('redirects the root path to the default locale event home', () => {
    const response = middleware(createRequest('/'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/en-US/eventHome');
  });

  it('redirects protected routes to login without a token', () => {
    const response = middleware(createRequest('/es-AR/userProfile'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/es-AR/login');
  });

  it('allows protected routes with a token', () => {
    const response = middleware(createRequest('/es-AR/event/123', 'mock-token'));

    expect(response.status).toBe(200);
  });

  it('allows public routes without a token', () => {
    const response = middleware(createRequest('/es-AR/faq'));

    expect(response.status).toBe(200);
  });
});
