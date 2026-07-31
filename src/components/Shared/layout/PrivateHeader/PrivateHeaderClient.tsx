'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import LogButton from '@components/UI/LogButton';
import LinkCustom from '@components/UI/LinkCustom';

interface PrivateHeaderClientProps {
  user: IUserFromCookie | null;
  hasProfilePicture: boolean;
}

const NAVIGATION_ITEMS = [
  { href: '/eventHome', label: 'Mis Eventos' },
  { href: '/createEvent', label: 'Crear Evento' },
  { href: '/userProfile', label: 'Perfil' },
  { href: '/faq', label: 'FAQ' },
] as const;

export default function PrivateHeaderClient(props: PrivateHeaderClientProps) {
  const { pushTo, switchLanguage } = useCustomRouter();
  const pathname = usePathname();
  const { t } = useTranslation('userProfile');
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const initials = props.user?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name => name.charAt(0).toUpperCase())
    .join('');

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.privateHeader}>
        <nav className={styles.navbar}>
          <LinkCustom href="/eventHome" className={styles.brand} aria-label="FoodSpot">
            <span className={styles.brandMark} aria-hidden />
            <span>FoodSpot</span>
          </LinkCustom>

          <div className={styles.mainNavigation} aria-label="Navegación principal">
            {NAVIGATION_ITEMS.map(item => {
              const isActive = pathname.endsWith(item.href);
              const className = `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

              return (
                <LinkCustom href={item.href} className={className} key={item.href}>
                  {item.label}
                </LinkCustom>
              );
            })}
          </div>

          {props.user && (
            <div className={styles.userActions}>
              <span className={styles.welcomeMsg}>
                {t.headerWelcome} <strong>{props.user.name}</strong>
              </span>
              <button className={styles.initialsAvatar} onClick={() => pushTo('/userProfile')} aria-label="Perfil">
                {props.hasProfilePicture && !imageUnavailable ? (
                  <img src="/api/profile-image" alt="Foto de perfil" onError={() => setImageUnavailable(true)} />
                ) : initials}
              </button>
              <div className={styles.languageActions}>
                <button className={styles.spanishFlag} aria-label="Cambiar a español" onClick={() => switchLanguage('es-AR', pathname)} />
                <button className={styles.englishFlag} aria-label="Switch to English" onClick={() => switchLanguage('en-US', pathname)} />
              </div>
            </div>
          )}
          <LogButton user={props.user} className={styles.authAction} />
        </nav>
      </header>
    </div>
  );
}
