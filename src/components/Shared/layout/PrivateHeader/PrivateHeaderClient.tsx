'use client';

import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import LogButton from '@components/UI/LogButton';
import ProfileButton from '@components/UI/ProfileButton';

interface PrivateHeaderClientProps {
  user: IUserFromCookie | null;
  profileImage?: string;
}

export default function PrivateHeaderClient(props: PrivateHeaderClientProps) {
  const { pushTo, switchLanguage } = useCustomRouter();
  const pathname = usePathname();
  const { t } = useTranslation('userProfile');

  const handleGoToMain = (e: React.MouseEvent) => {
    e.preventDefault();
    pushTo(`/eventHome`);
  };

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.privateHeader}>
        <nav className={styles.navbar}>
          {props.user && (
            <div className={styles.welcomeMsg}>
              {t.headerWelcome} {props.user.name}
              {props.profileImage && <ProfileButton image={props.profileImage} />}
              <button className={styles.spanishFlag} onClick={() => switchLanguage('es-AR', pathname)} />
              <button className={styles.englishFlag} onClick={() => switchLanguage('en-US', pathname)} />
            </div>
          )}
          <LogButton user={props.user} />
        </nav>
      </header>

      <section className={styles.lowerHeader}>
        <button className={styles.logo} onClick={handleGoToMain}></button>
        <div className={styles.fire}></div>
      </section>
    </div>
  );
}
