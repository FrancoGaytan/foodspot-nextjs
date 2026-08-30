import { IPublicUser, IsUserDebtorResponse } from '@models/user';
import { getServer } from './httpServer';

/**
 * Gets a user by its ID
 */
export async function getUserById(id: unknown, signal?: AbortSignal): Promise<IPublicUser> {
  const url = `/users/getUserById/${id}`;
  return await getServer(url, signal);
}

export async function isUserDebtor(idUser: string, signal?: AbortSignal): Promise<IsUserDebtorResponse> {
  const url = `/users/isDebtor/${idUser}`;
  return await getServer<IsUserDebtorResponse>(url, signal);
}

export async function getPendingTransferEventIds(userId: string, signal?: AbortSignal): Promise<string[]> {
  return await getServer<string[]>(`/users/hasPendingTransfers/${userId}`, signal);
}
