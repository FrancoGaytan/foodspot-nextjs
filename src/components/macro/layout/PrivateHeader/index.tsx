'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getUserById } from '@services/userService';
import { getImage } from '@services/purchaseReceipts';
import { IPublicUser } from '@models/user';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { getUserFromCookie, IUserFromCookie } from '@utils/localeCookies';
import LogButton from '@components/micro/LogButton';
import ProfileButton from '@components/micro/ProfileButton';

export default function PrivateHeader() {
  const { pushTo, switchLanguage } = useCustomRouter();
  const pathname = usePathname();
  const { t } = useTranslation('userProfile');
  const [userData, setUserData] = useState<IPublicUser | undefined>();
  const [image, setImage] = useState<File | undefined>();
  const [user, setUser] = useState<IUserFromCookie | null>(null);

  useEffect(() => {
    const cookieUser = getUserFromCookie();
    setUser(cookieUser);
  }, []);

  useEffect(() => {
    if (user) {
      getUserById(user.id)
        .then(resp => {
          setUserData(resp);
          if (resp.profilePicture) {
            getImage(resp.profilePicture)
              .then(res => setImage(res))
              .catch(e => console.error('Error loading image:', e));
          }
        })
        .catch(e => console.error('Error loading user data:', e));
    }
  }, [user]);

  const handleGoToMain = (e: React.MouseEvent) => {
    e.preventDefault();
    pushTo(`/eventHome`);
  };

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.privateHeader}>
        <nav className={styles.navbar}>
          {user && (
            <div className={styles.welcomeMsg}>
              {t.headerWelcome} {user.name}
              {userData?.profilePicture && <ProfileButton image={image} />}
              <button className={styles.spanishFlag} onClick={() => switchLanguage('es-AR', pathname)} />
              <button className={styles.englishFlag} onClick={() => switchLanguage('en-US', pathname)} />
            </div>
          )}
          <LogButton user={user} />
        </nav>
      </header>

      <section className={styles.lowerHeader}>
        <button className={styles.logo} onClick={handleGoToMain}></button>
        <div className={styles.fire}></div>
      </section>
    </div>
  );
}
