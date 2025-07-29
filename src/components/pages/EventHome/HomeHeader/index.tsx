'use client';
import Button, { ButtonKind } from '@components/micro/Button';
import styles from '../styles.module.scss'; //chequea si esta bien
import { useCustomRouter } from '@hooks/useCustomRouter';

export default function HomeHeader(props: { t: Record<string, string> }) {
  const router = useCustomRouter();

  return (
    <section className={styles.header}>
      <Button kind={ButtonKind.PRIMARY} size="large" onClick={() => router.pushTo('/createEvent')}>
        {props.t.newEventButton}
      </Button>
    </section>
  );
}
