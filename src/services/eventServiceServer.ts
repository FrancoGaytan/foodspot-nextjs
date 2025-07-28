import { IPublicEvent } from '@models/event';
import { getServer } from './httpServer';

export async function getPublicEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
  const url = '/events/getPublicEvents';
  return await getServer<IPublicEvent[]>(url, signal);
}

export async function getPublicAndPrivateEvents(signal?: AbortSignal): Promise<IPublicEvent[]> {
  const url = '/events/getPublicAndPrivateEvents';
  return await getServer<IPublicEvent[]>(url, signal);
}
