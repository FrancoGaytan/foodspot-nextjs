'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
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
  { href: '/eventHome', label: 'Eventos', desktopLabel: 'Mis Eventos', icon: 'calendar_month' },
  { href: '/createEvent', label: 'Crear', desktopLabel: 'Crear Evento', icon: 'add' },
  { href: '/userProfile', label: 'Perfil', desktopLabel: 'Perfil', icon: 'person_outline' },
  { href: '/faq', label: 'FAQ', desktopLabel: 'FAQ', icon: 'help_outline' },
] as const;

export default function PrivateHeaderClient(props: PrivateHeaderClientProps) {
  const { pushTo } = useCustomRouter();
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
        <div className={styles.navbar}>
          <LinkCustom href="/eventHome" className={styles.brand} aria-label="FoodSpot">
            <span className={styles.brandMark} aria-hidden />
            <span>FoodSpot</span>
          </LinkCustom>

          <nav
            className={styles.mainNavigation}
            aria-label="Navegación principal"
          >
            {NAVIGATION_ITEMS.map(item => {
              const isActive = pathname.endsWith(item.href);
              const className = `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

              return (
                <LinkCustom href={item.href} className={className} key={item.href} aria-current={isActive ? 'page' : undefined}>
                  {item.desktopLabel}
                </LinkCustom>
              );
            })}
          </nav>

          {props.user && (
            <div className={styles.userActions}>
              <span className={styles.welcomeMsg}>
                {t.headerWelcome} <strong>{props.user.name}</strong>
              </span>
              <button type="button" className={styles.initialsAvatar} onClick={() => pushTo('/userProfile')} aria-label="Perfil">
                {props.hasProfilePicture && !imageUnavailable ? (
                  <Image
                    src="/api/profile-image"
                    alt="Foto de perfil"
                    width={40}
                    height={40}
                    onError={() => setImageUnavailable(true)}
                  />
                ) : initials}
              </button>
            </div>
          )}
          <LogButton user={props.user} className={styles.authAction} />
        </div>
      </header>
      {props.user && (
        <nav className={styles.bottomNavigation} aria-label="Navegación principal">
          {NAVIGATION_ITEMS.map(item => {
            const isActive = pathname.endsWith(item.href);

            return (
              <LinkCustom
                href={item.href}
                key={item.href}
                className={`${styles.bottomNavLink} ${isActive ? styles.bottomNavLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="material-icons" aria-hidden>{item.icon}</span>
                <span>{item.label}</span>
              </LinkCustom>
            );
          })}
        </nav>
      )}
    </div>
  );
}
