import { getToken } from '@utils/cookies/localeCookiesServer';

const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(/\/$/, '');

export class ServerHttpError extends Error {
  constructor(
    public readonly method: string,
    public readonly path: string,
    public readonly status: number,
    public readonly responseBody?: string
  ) {
    super(`${method} ${path} failed: ${status}`);
    this.name = 'ServerHttpError';
  }
}

function buildUrl(path: string) {
  if (!baseURL) {
    throw new Error('Missing NEXT_PUBLIC_API_ENDPOINT environment variable');
  }

  return `${baseURL}${path}`;
}

export async function getAuthHeadersWithAuth(includeContentType = true): Promise<HeadersInit> {
  const token = await getToken();

  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = token;
  }

  return headers;
}

async function getErrorResponseBody(response: Response): Promise<string | undefined> {
  const responseBody = await response.text();
  return responseBody || undefined;
}

export async function postServer<T, P = unknown>(path: string, payload?: P, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeadersWithAuth();
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    signal,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ServerHttpError('POST', path, res.status, await getErrorResponseBody(res));
  }

  return res.json();
}

export async function getServer<T>(path: string, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeadersWithAuth();
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers,
    signal,
    cache: 'no-store',
    credentials: 'same-origin',
    mode: 'cors',
  });

  if (!res.ok) {
    throw new ServerHttpError('GET', path, res.status, await getErrorResponseBody(res));
  }

  return res.json();
}

export async function getFileServer(path: string, signal?: AbortSignal): Promise<Blob> {
  const headers = await getAuthHeadersWithAuth();
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers,
    signal,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ServerHttpError('GET', path, res.status, await getErrorResponseBody(res));
  }

  return res.blob();
}

export async function postFileServer<T>(path: string, formFile: File, signal?: AbortSignal): Promise<T> {
  const formData = new FormData();
  formData.append('file', formFile);
  const headers = await getAuthHeadersWithAuth(false);

  const res = await fetch(buildUrl(path), {
    method: 'POST',
    body: formData,
    signal,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ServerHttpError('POST', path, res.status, await getErrorResponseBody(res));
  }

  return res.json();
}

export async function putServer<T, P = unknown>(path: string, payload?: P, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeadersWithAuth();
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    signal,
    headers,
    body: payload === undefined ? undefined : JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ServerHttpError('PUT', path, res.status, await getErrorResponseBody(res));
  }

  return res.json();
}

export async function putFileServer<T>(path: string, formFile: File, signal?: AbortSignal): Promise<T> {
  const formData = new FormData();
  formData.append('file', formFile);
  const headers = await getAuthHeadersWithAuth(false);

  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    body: formData,
    signal,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ServerHttpError('PUT', path, res.status, await getErrorResponseBody(res));
  }

  return res.json();
}

export async function deleteServer<T = any>(path: string, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeadersWithAuth();

  const res = await fetch(buildUrl(path), {
    method: 'DELETE',
    signal,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new ServerHttpError('DELETE', path, res.status, await getErrorResponseBody(res));
  }

  return res.json();
}
