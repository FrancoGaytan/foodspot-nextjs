import { IEvent, IPublicEvent } from '@models/event';
import { _get, _put } from './httpService';

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
