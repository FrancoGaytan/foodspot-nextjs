import BackBtn from '@components/UI/BackBtn';
import styles from './styles.module.scss';
import { getEventById } from '@services/eventServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import EventBtns from '@components/Modules/Event/EventBtns';
import EventData from './EventData';
import PurchasesData from './PurchasesData';
import ResponsibilitiesData from './ResposibilitiesData';
import ParticipantsData from './ParticipantsData';
import InteractiveRating from './InteractiveRating';
import { EventStatesEnum } from 'enums/EventState.enum';

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
      {userFromCookie && [EventStatesEnum.CLOSED, EventStatesEnum.READY_FOR_PAYMENT, EventStatesEnum.FINISHED].includes(event.state as EventStatesEnum) && (
        <InteractiveRating eventId={event._id} userId={userFromCookie.id} />
      )}
      <div className={styles.eventContent}>
        <section className={styles.leftColumn}>
          <EventData event={event} userId={userFromCookie?.id} />
          {userFromCookie && <PurchasesData event={event} user={userFromCookie} />}
        </section>
        <section className={styles.rightColumn}>
          <ResponsibilitiesData event={event} userId={userFromCookie?.id} />
          <ParticipantsData event={event} userId={userFromCookie?.id}/>
        </section>
      </div>
      {userFromCookie && <EventBtns event={event} user={userFromCookie} />}
    </div>
  );
}
