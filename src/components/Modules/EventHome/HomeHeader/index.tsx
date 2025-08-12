'use client';
import Button, { ButtonKind } from '@components/UI/Button';
import styles from '../styles.module.scss';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { useTranslation } from '@hooks/useTranslation';

export default function HomeHeader() {
  const router = useCustomRouter();
  const { t } = useTranslation('eventHome');

  return (
    <section className={styles.header}>
      <Button kind={ButtonKind.PRIMARY} size="large" onClick={() => router.pushTo('/createEvent')}>
        {t.newEventButton}
      </Button>
    </section>
  );
}
