'use client';
import { IUploadFileResponse } from '@models/transfer';

const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

function getToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie.split('; ').find(row => row.startsWith('jwt='));

  return cookie?.split('=')[1] ?? null;
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ?? '',
  };
}

export async function _get<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      method: 'GET',
      signal,
      headers: getAuthHeaders(),
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('GET request failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}

export async function __getFiles(path: string, signal?: AbortSignal): Promise<Blob> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      method: 'GET',
      signal,
      headers: {
        Authorization: getToken() ?? '',
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('GET Files request failed');
    return await response.blob();
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}

export async function _post<T, P = unknown>(path: string, payload?: P, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      method: 'POST',
      signal,
      headers: getAuthHeaders(),
      body: payload ? JSON.stringify(payload) : undefined,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('POST request failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}

export async function _postFiles(formFile: any, path: string, signal?: AbortSignal): Promise<IUploadFileResponse> {
  try {
    const formData = new FormData();
    formData.append('file', formFile);

    const response = await fetch(`${baseURL}${path}`, {
      method: 'POST',
      signal,
      headers: {
        Authorization: getToken() ?? '',
      },
      body: formData,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('POST Files request failed');
    return (await response.json()) as IUploadFileResponse; //check if the backend returns a json
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}

export async function _put<T, P = unknown>(path: string, payload: P, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      method: 'PUT',
      signal,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('PUT request failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}

export async function _putFiles<T>(
  formFile: File | Blob, // this was any, check if breaks
  path: string,
  signal?: AbortSignal
): Promise<T> {
  try {
    const formData = new FormData();
    formData.append('file', formFile);

    const response = await fetch(`${baseURL}${path}`, {
      method: 'PUT',
      signal,
      headers: {
        Authorization: getToken() ?? '',
      },
      body: formData,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('PUT request failed');
    return (await response.json()) as T; //checkear si el backend devuelve un json
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}

export async function _delete<T = unknown>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      method: 'DELETE',
      signal,
      headers: getAuthHeaders(),
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    });

    if (!response.ok) throw new Error('DELETE request failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
}
