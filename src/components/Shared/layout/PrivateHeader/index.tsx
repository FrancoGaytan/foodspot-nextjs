import { getUserById } from '@services/userServiceServer';
import { getImage } from '@services/purchaseReceiptsServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import PrivateHeaderClient from './PrivateHeaderClient';

export default async function PrivateHeader() {
  const user = await getUserFromCookieServer();

  if (!user) {
    return <PrivateHeaderClient user={null} />;
  }

  let profileImage: string | undefined;

  try {
    const userData = await getUserById(user.id);

    if (userData.profilePicture) {
      const image = await getImage(userData.profilePicture);
      const imageBuffer = Buffer.from(await image.arrayBuffer()).toString('base64');
      profileImage = `data:${image.type};base64,${imageBuffer}`;
    }
  } catch (error) {
    console.error('Error loading private header data:', error);
  }

  return <PrivateHeaderClient user={user} profileImage={profileImage} />;
}
