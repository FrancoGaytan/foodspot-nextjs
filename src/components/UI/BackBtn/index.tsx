'use client';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';
import { useCustomRouter } from '@hooks/useCustomRouter';
export default function BackBtn() {
  const { t } = useTranslation('eventHome');
  const { pushTo } = useCustomRouter();

  return (
    <section className={styles.backBtnSection} onClick={() => pushTo('/eventHome')}>
      <button className={styles.backBtn}></button>
      <span className={styles.backText}>{t.backBtn}</span>
    </section>
  );
}
