import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import { getUserById } from '@services/userServiceServer';
import PrivateHeaderClient from './PrivateHeaderClient';

export default async function PrivateHeader() {
  const user = await getUserFromCookieServer();

  if (!user) {
    return <PrivateHeaderClient user={null} hasProfilePicture={false} />;
  }

  const profile = await getUserById(user.id).catch(() => null);
  return <PrivateHeaderClient user={user} hasProfilePicture={Boolean(profile?.profilePicture)} />;
}
