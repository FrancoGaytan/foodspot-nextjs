'use client';

import { IUserFromCookie } from '@utils/cookies/localeCookies';
import styles from './styles.module.scss';
import { logoutClient } from '@utils/common/clientUtilities';
import { useTranslation } from '@hooks/useTranslation';
import { useCustomRouter } from '@hooks/useCustomRouter';

interface LogButtonProps {
  user: IUserFromCookie | null;
}

export default function LogButton(props: LogButtonProps) {
  const { t } = useTranslation('userProfile');
  const { pushTo } = useCustomRouter();
  const user = props.user;

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutClient();
    pushTo(`/login`);
  };

  return (
    <div className={styles.logBtnSection}>
      {!!user?.name ? (
        <>
          <button className={styles.logoutBtn} onClick={handleLogout}></button>
          <span className={styles.loginLogoutDesc} onClick={handleLogout}>
            {t.logoutBtn}
          </span>
        </>
      ) : (
        <>
          <button className={styles.loginBtn} onClick={() => pushTo(`/login`)}></button>
          <span className={styles.loginLogoutDesc} onClick={() => pushTo(`/login`)}>
            {t.loginBtn}
          </span>
        </>
      )}
    </div>
  );
}
