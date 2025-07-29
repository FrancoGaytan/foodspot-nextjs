'use server';

import styles from './styles.module.scss';
import EventsContainer from './EventsContainer';
import HomeHeader from './HomeHeader';

interface EventHomeProps {
  t: Record<string, string>;
}

export default async function eventHome(props: EventHomeProps) {
  const t = props.t;
  return (
    <div className={styles.eventHomeContent}>
      <HomeHeader t={t} />
      <h1 className={styles.incomingEventTitle}>{t.incomingEvents}</h1>
      <section className={styles.eventsContainer}>
        <EventsContainer />
      </section>
    </div>
  );
}
