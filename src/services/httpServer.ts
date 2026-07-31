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

export async function getAuthHeadersWithAuth(): Promise<HeadersInit> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = token;
  }

  return headers;
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
    throw new ServerHttpError('POST', path, res.status, await res.text());
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

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} - ${text}`);
  }

  return JSON.parse(text);
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
    throw new Error(`GET file ${path} failed: ${res.status}`);
  }

  return res.blob();
}

export async function postFileServer<T>(path: string, formFile: File, signal?: AbortSignal): Promise<T> {
  const formData = new FormData();
  formData.append('file', formFile);

  const res = await fetch(buildUrl(path), {
    method: 'POST',
    body: formData,
    signal,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`POST file ${path} failed: ${res.status}`);
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
    throw new Error(`PUT ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function putFileServer<T>(path: string, formFile: File, signal?: AbortSignal): Promise<T> {
  const formData = new FormData();
  formData.append('file', formFile);

  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    body: formData,
    signal,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`PUT file ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function deleteServer<T = any>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'DELETE',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`DELETE ${path} failed: ${res.status}`);
  }

  return res.json();
}
