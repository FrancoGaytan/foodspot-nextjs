import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getEventById,
  getPublicAndPrivateEvents,
  getPublicEvents,
  subscribeToAnEvent,
  unsubscribeFromEvent,
} from '../src/services/eventServiceServer';
import { getPendingTransferEventIds, isUserDebtor } from '../src/services/userServiceServer';

const { getServer, putServer } = vi.hoisted(() => ({
  getServer: vi.fn(),
  putServer: vi.fn(),
}));

vi.mock('../src/services/httpServer', () => ({
  getServer,
  putServer,
}));

describe('Event Home service contracts', () => {
  beforeEach(() => {
    getServer.mockReset();
    putServer.mockReset();
  });

  it('loads the public list for anonymous visitors', async () => {
    const signal = new AbortController().signal;
    getServer.mockResolvedValue([]);

    await expect(getPublicEvents(signal)).resolves.toEqual([]);
    expect(getServer).toHaveBeenCalledWith('/events/getPublicEvents', signal);
  });

  it('loads public and private events for authenticated visitors', async () => {
    const signal = new AbortController().signal;
    getServer.mockResolvedValue([]);

    await expect(getPublicAndPrivateEvents(signal)).resolves.toEqual([]);
    expect(getServer).toHaveBeenCalledWith('/events/getPublicAndPrivateEvents', signal);
  });

  it('loads event detail by identifier', async () => {
    getServer.mockResolvedValue({ _id: 'event-1' });

    await expect(getEventById('event-1')).resolves.toEqual({ _id: 'event-1' });
    expect(getServer).toHaveBeenCalledWith('/events/getEventById/event-1', undefined);
  });

  it('subscribes a user to an event', async () => {
    const signal = new AbortController().signal;
    putServer.mockResolvedValue({ _id: 'event-1' });

    await expect(subscribeToAnEvent('user-1', 'event-1', signal)).resolves.toEqual({ _id: 'event-1' });
    expect(putServer).toHaveBeenCalledWith('/events/subscribeToAnEvent/user-1/event-1', undefined, signal);
  });

  it('unsubscribes a user from an event', async () => {
    const signal = new AbortController().signal;
    putServer.mockResolvedValue({ _id: 'event-1' });

    await expect(unsubscribeFromEvent('user-1', 'event-1', signal)).resolves.toEqual({ _id: 'event-1' });
    expect(putServer).toHaveBeenCalledWith('/events/unsubscribeFromEvent/user-1/event-1', undefined, signal);
  });

  it('loads debtor event IDs for the authenticated user', async () => {
    getServer.mockResolvedValue(['event-1']);

    await expect(isUserDebtor('user-1')).resolves.toEqual(['event-1']);
    expect(getServer).toHaveBeenCalledWith('/users/isDebtor/user-1', undefined);
  });

  it('loads pending transfer event IDs for the authenticated user', async () => {
    getServer.mockResolvedValue(['event-1']);

    await expect(getPendingTransferEventIds('user-1')).resolves.toEqual(['event-1']);
    expect(getServer).toHaveBeenCalledWith('/users/hasPendingTransfers/user-1', undefined);
  });
});
