import BackBtn from '@components/UI/BackBtn';
import styles from './styles.module.scss';
import { getEventById } from '@services/eventServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import EventBtns from '@components/Modules/Event/EventBtns';

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
      {userFromCookie && <EventBtns event={event} user={userFromCookie} />}
    </div>
  );
}
