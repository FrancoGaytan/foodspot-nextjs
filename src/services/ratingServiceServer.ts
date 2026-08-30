import { IRatingRequest, IRatingResponse } from '@models/ratings';
import { getServer, postServer } from './httpServer';

export async function createRating(eventId: string, userId: string, payload: IRatingRequest, signal?: AbortSignal): Promise<IRatingResponse> {
  return await postServer<IRatingResponse, IRatingRequest>(`/ratings/createRating/${eventId}/${userId}`, payload, signal);
}

export async function getRatingFromUser(eventId: string, userId: string, signal?: AbortSignal): Promise<IRatingResponse> {
  return await getServer<IRatingResponse>(`/ratings/getRatingFromUser/${eventId}/${userId}`, signal);
}