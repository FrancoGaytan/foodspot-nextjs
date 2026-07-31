import { getFileServer } from '@services/httpServer';
import { getUserById } from '@services/userServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';

export async function GET() {
  const user = await getUserFromCookieServer();
  if (!user) return new Response(null, { status: 401 });

  try {
    const profile = await getUserById(user.id);
    if (!profile.profilePicture) return new Response(null, { status: 404 });

    const image = await getFileServer(`/images/getImage/${profile.profilePicture}`);
    return new Response(image.stream(), {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Type': image.type || 'application/octet-stream',
      },
    });
  } catch (error) {
    console.error('Error loading profile image:', error);
    return new Response(null, { status: 404 });
  }
}