import { cookies } from 'next/headers';

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = (await cookies()).get('jwt')?.value;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
