'use client';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';
import { useCustomRouter } from '@hooks/useCustomRouter';
export default function BackBtn() {
  const { t } = useTranslation('eventHome');
  const { pushTo } = useCustomRouter();

  return (
    <button type="button" className={styles.backBtnSection} onClick={() => pushTo('/eventHome')}>
      <span className={styles.backBtn} aria-hidden />
      <span className={styles.backText}>{t.backBtn}</span>
    </button>
  );
}
