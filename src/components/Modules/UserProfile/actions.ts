'use server';

import { putFileServer, putServer } from '@services/httpServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';

export type ProfileActionState = { success: boolean; error?: 'unauthorized' | 'updateFailed' };

export async function updateProfile(_previousState: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const user = await getUserFromCookieServer();
  if (!user) return { success: false, error: 'unauthorized' };

  const notifications = {
    newEvent: formData.get('newEvent') === 'on',
    eventStart: formData.get('eventStart') === 'on',
    penalizationStart: formData.get('penalizationStart') === 'on',
    penalizationOneWeek: formData.get('penalizationOneWeek') === 'on',
  };

  try {
    await putServer(`/users/editUser/${user.id}`, {
      name: String(formData.get('name') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      alternativeEmail: String(formData.get('alternativeEmail') ?? '').trim() || null,
      cbu: String(formData.get('cbu') ?? '').trim() || null,
      alias: String(formData.get('alias') ?? '').trim() || null,
      specialDiet: formData.getAll('specialDiet').map(String),
      notifications,
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'updateFailed' };
  }
}

export async function updateProfileImage(formData: FormData): Promise<void> {
  const user = await getUserFromCookieServer();
  const file = formData.get('file');

  if (!user || !(file instanceof File) || !file.type.startsWith('image/')) {
    throw new Error('Invalid profile image');
  }

  await putFileServer(`/users/editProfilePicture/${user.id}`, file);
}