import { IEvent, IPublicEvent } from '@models/event';
import { getServer } from './httpServer';
import { ITransferReceiptInfoResponse, PayCheckInfoResponse } from '@models/transfer';

export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
  const url = '/events/getPublicEvents';
  return await getServer<IPublicEvent[]>(url, signal);
}

export async function getPublicAndPrivateEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
  const url = '/events/getPublicAndPrivateEvents';
  return await getServer<IPublicEvent[]>(url, signal);
}

export async function getEventById(id: string | undefined, signal?: AbortSignal): Promise<IEvent> {
  const url = `/events/getEventById/${id}`;
  return await getServer<IEvent>(url, signal);
}

export async function getMembersAmount(eventId: string, signal?: AbortSignal): Promise<PayCheckInfoResponse[]> {
  const url = `/events/getMembersAmount/${eventId}`;
  return await getServer(url, signal);
}

export async function getMembersAndReceiptsInfo(eventId: string, signal?: AbortSignal): Promise<ITransferReceiptInfoResponse[]> {
  const url = `/events/getMembersAndReceiptsInfo/${eventId}`;
  return await getServer(url, signal);
}
