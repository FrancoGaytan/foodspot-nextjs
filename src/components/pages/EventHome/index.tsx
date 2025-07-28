'use server';

import Button, { ButtonKind } from '@components/micro/Button';
import LinkCustom from '@components/micro/LinkCustom';
import styles from './styles.module.scss';
import EventsContainer from './EventsContainer';

interface EventHomeProps {
  t: Record<string, string>;
}

export default async function eventHome(props: EventHomeProps) {
  const t = props.t;
  return (
    <div className={styles.eventHomeContent}>
      <section className={styles.header}>
        <Button kind={ButtonKind.PRIMARY} size="large">
          {t.newEventButton}
          <LinkCustom href="/createEvent" />
        </Button>
      </section>
      <h1 className={styles.incomingEventTitle}>{t.incomingEvents}</h1>
      <section className={styles.eventsContainer}>
        <EventsContainer />
      </section>
    </div>
  );
}
