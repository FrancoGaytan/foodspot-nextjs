'use server';

import { postServer } from '@services/httpServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';

export type CreateEventActionState = { success: boolean; error?: 'unauthorized' | 'invalidData' | 'createFailed' };

interface CreateEventPayload {
  title: string;
  datetime: string;
  description: string;
  memberLimit: number;
  isPrivate: boolean;
  penalization: number | null;
  penalizationStartDate: string | null;
  isChef: boolean;
  isShoppingDesignee: boolean;
}

export async function createEvent(_previousState: CreateEventActionState, formData: FormData): Promise<CreateEventActionState> {
  const user = await getUserFromCookieServer();
  if (!user) return { success: false, error: 'unauthorized' };

  let payload: CreateEventPayload;
  try {
    payload = JSON.parse(String(formData.get('payload') ?? '')) as CreateEventPayload;
  } catch {
    return { success: false, error: 'invalidData' };
  }

  if (!payload.title || !payload.datetime || !payload.description || !Number.isFinite(payload.memberLimit) || payload.memberLimit < 1) {
    return { success: false, error: 'invalidData' };
  }

  try {
    await postServer('/events/createEvent', {
      title: payload.title,
      datetime: payload.datetime,
      description: payload.description,
      memberLimit: payload.memberLimit,
      isPrivate: payload.isPrivate,
      penalization: payload.penalization,
      penalizationStartDate: payload.penalizationStartDate,
      organizer: user.id,
      members: [user.id],
      state: 'available',
      isChef: payload.isChef,
      isShoppingDesignee: payload.isShoppingDesignee,
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error: 'createFailed' };
  }
}