import { IPublicUser } from '@models/user';
import { getServer } from './httpServer';

/**
 * Gets a user by its ID
 */
export async function getUserById(id: unknown, signal?: AbortSignal): Promise<IPublicUser> {
  const url = `/users/getUserById/${id}`;
  return await getServer(url, signal);
}
