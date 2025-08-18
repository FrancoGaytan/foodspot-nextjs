import BackBtn from '@components/UI/BackBtn';
import styles from './styles.module.scss';
import { getEventById } from '@services/eventServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import EventBtns from '@components/Modules/Event/EventBtns';
import EventData from './EventData';
import PurchasesData from './PurchasesData';

type EventProps = {
  params: { id: string };
};

export default async function Event(props: EventProps) {
  const params = await props.params;
  const eventId = params.id;
  const userFromCookie = await getUserFromCookieServer();
  const event = await getEventById(eventId);

  return (
    <div className={styles.eventContainer}>
      <BackBtn />
      <h1 className={styles.eventTitle}>{event.title}</h1>
      <div className={styles.eventContent}>
        <section className={styles.leftColumn}>
          <EventData event={event} />
          {userFromCookie && <PurchasesData event={event} user={userFromCookie} />}
        </section>
        <section className={styles.rightColumn}></section>
      </div>
      {userFromCookie && <EventBtns event={event} user={userFromCookie} />}
    </div>
  );
}
