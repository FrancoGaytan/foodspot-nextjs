'use client';

import { IUserFromCookie } from '@utils/cookies/localeCookies';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { handleLogout } from 'app/[lang]/logout/actions';

interface LogButtonProps {
  user: IUserFromCookie | null;
  className?: string;
}

export default function LogButton(props: LogButtonProps) {
  const { t } = useTranslation('userProfile');
  const { pushTo } = useCustomRouter();
  const user = props.user;

  const handleLogoutClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await handleLogout();
    pushTo(`/login`);
  };

  return (
    <div className={`${styles.logBtnSection} ${props.className ?? ''}`}>
      {!!user?.name ? (
        <button type="button" className={styles.authButton} onClick={handleLogoutClick}>
          <span className={styles.logoutBtn} aria-hidden />
          <span className={styles.loginLogoutDesc}>
            {t.logoutBtn}
          </span>
        </button>
      ) : (
        <button type="button" className={styles.authButton} onClick={() => pushTo(`/login`)}>
          <span className={styles.loginBtn} aria-hidden />
          <span className={styles.loginLogoutDesc}>
            {t.loginBtn}
          </span>
        </button>
      )}
    </div>
  );
}
