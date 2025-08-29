import { IEvent, IPublicEvent } from '@models/event';
import { _get, _put } from './httpService';
import { ITransferReceiptInfoResponse, PayCheckInfoResponse } from '@models/transfer';

export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
  const url = '/events/getPublicEvents';
  return await _get<IPublicEvent[]>(url, signal);
}

export async function getPublicAndPrivateEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
  const url = '/events/getPublicAndPrivateEvents';
  return await _get<IPublicEvent[]>(url, signal);
}

export async function getEventById(id: string | undefined, signal?: AbortSignal): Promise<IEvent> {
  const url = `/events/getEventById/${id}`;
  return await _get<IEvent>(url, signal);
}

export async function subscribeToAnEvent(userId: string, eventId: string, signal?: AbortSignal): Promise<IEvent> {
  const url = `/events/subscribeToAnEvent/${userId}/${eventId}`;
  return await _put<IEvent>(url, signal);
}

/**
 *
Edits just the chef or shopping designee by its ID
 */

export async function editRoles(id: string, payload: IEvent, signal?: AbortSignal): Promise<IEvent> {
	const url = `/events/editRoles/${id}`;
	return await _put<IEvent, IEvent>(url, payload, signal);
}

export async function getMembersAmount(eventId: string, signal?: AbortSignal): Promise<PayCheckInfoResponse[]> {
  const url = `/events/getMembersAmount/${eventId}`;
  return await _get(url, signal);
}

export async function getMembersAndReceiptsInfo(eventId: string, signal?: AbortSignal): Promise<ITransferReceiptInfoResponse[]> {
  const url = `/events/getMembersAndReceiptsInfo/${eventId}`;
  return await _get(url, signal);
}