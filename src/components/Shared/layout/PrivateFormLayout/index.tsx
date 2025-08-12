'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import { getUserById } from '@services/userService';
import { IPublicUser } from '@models/user';
import { getImage } from '@services/purchaseReceipts';
import { useTranslation } from '@hooks/useTranslation';

interface PrivateFormLayoutProps {
  children: React.ReactNode;
}

export default function PrivateFormLayout(props: PrivateFormLayoutProps) {
  const authContext = useAuth();
  const { t, lang } = useTranslation('userProfile');
  const router = useRouter();
  const pathname = usePathname();

  const [userData, setUserData] = useState<IPublicUser | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (authContext.user) {
      getUserById(authContext.user.id)
        .then(resp => {
          setUserData(resp);
          if (resp.profilePicture) {
            getImage(resp.profilePicture)
              .then(res => setImage(res))
              .catch(e => console.error('Catch in context: ', e));
          }
        })
        .catch(e => console.error('Catch in context:', e));
    }
  }, [authContext.user]);

  function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    authContext.logout(lang);
  }

  function handleGoToProfile(e: React.MouseEvent) {
    e.preventDefault();
    router.push(`/${lang}/userProfile`);
  }

  function handleGoToMain(e: React.MouseEvent) {
    e.preventDefault();
    router.push(`/${lang}`);
  }

  function switchLanguage(langId: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `locale=${langId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }

    const newPath = pathname.replace(/^\/[a-zA-Z-]+/, `/${langId}`);
    router.push(newPath);
  }

  return (
    <div className={styles.privateContainer}>
      <header className={styles.privateHeader}>
        <nav className={styles.navbar}>
          {!!authContext.user?.name && (
            <div className={styles.welcomeMsg}>
              {t.headerWelcome} {authContext.user.name}
              {userData?.profilePicture && image instanceof Blob ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.profileBtn} src={URL.createObjectURL(image)} alt="selected" onClick={handleGoToProfile} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/assets/pictures/profile.png" className={styles.profileBtn} alt="placeholder" onClick={handleGoToProfile} />
              )}
              <button className={styles.spanishFlag} onClick={() => switchLanguage('es-AR')} />
              <button className={styles.englishFlag} onClick={() => switchLanguage('en-US')} />
            </div>
          )}

          <div className={styles.logoutBtnSection}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              {!!authContext.user?.name ? t.logoutBtn : t.loginBtn}
            </button>
          </div>
        </nav>
      </header>

      <section className={styles.secondHeader}>
        <button className={styles.logo} onClick={handleGoToMain}></button>
        <div className={styles.fire}></div>
      </section>

      <section className={styles.containerLayout}>{props.children}</section>

      <footer className={styles.footerFire}></footer>
    </div>
  );
}
