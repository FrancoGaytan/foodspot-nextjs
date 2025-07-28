//import { getAuthHeaders } from '@utils/authHeaders';
import { getToken } from '@utils/localeCookiesServer';

const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT; //TODO: cambiarles el nombre, sacales el Server cuando esten todas los servicios andando

function buildUrl(path: string) {
  return `${baseURL}${path}`;
}

export async function getAuthHeadersWithAuth(): Promise<HeadersInit> {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function postServer<T, P = unknown>(path: string, payload?: P, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`POST ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function getServer<T>(path: string, signal?: AbortSignal): Promise<T> {
  const headers = await getAuthHeadersWithAuth();
  const fullUrl = buildUrl(path);

  console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET);

  console.log('📡 GET URL:', fullUrl);
  console.log('📦 Headers:', headers);

  const res = await fetch(fullUrl, {
    method: 'GET',
    headers,
    signal,
    cache: 'no-store',
    credentials: 'same-origin', // ⬅️ CRÍTICO si el backend espera cookies
    mode: 'cors', // opcional, pero consistente con cliente
  });

  const text = await res.text();

  if (!res.ok) {
    console.error(`❌ GET ${path} failed: ${res.status} - ${res.statusText}`);
    console.error('🔍 Response body:', text);
    throw new Error(`GET ${path} failed: ${res.status}`);
  }

  return JSON.parse(text);
}

export async function getFileServer(path: string, signal?: AbortSignal): Promise<Blob> {
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    headers: {
      // 'Authorization': '...' // si en el futuro agrego auth desde cookie
    },
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
    // headers: { 'Authorization': '...' } // si luego usás cookie auth
  });

  if (!res.ok) {
    throw new Error(`POST file ${path} failed: ${res.status}`);
  }

  return res.json();
}

export async function putServer<T, P = any>(path: string, payload: P, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
