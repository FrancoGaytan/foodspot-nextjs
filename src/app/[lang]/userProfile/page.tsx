import UserProfile from '@components/Modules/UserProfile';
import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import { getUserById } from '@services/userServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';

export default async function UserProfilePage() {
  const user = await getUserFromCookieServer();
  const profile = user ? await getUserById(user.id).catch(() => null) : null;

  return (
    <>
      <PrivateHeader />
      <UserProfile user={profile} />
    </>
  );
}