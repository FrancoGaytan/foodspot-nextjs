import styles from './styles.module.scss';
import EventsContainer from './EventsContainer';
import HomeHeader from './HomeHeader';
import { getTranslation } from '@utils/getTranslation';

export default async function eventHome() {
  const { t } = await getTranslation('eventHome');
  return (
    <div className={styles.eventHomeContent}>
      <HomeHeader />
      <h1 className={styles.incomingEventTitle}>{t.incomingEvents}</h1>
      <section className={styles.eventsContainer}>
        <EventsContainer />
      </section>
    </div>
  );
}
