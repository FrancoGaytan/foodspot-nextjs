'use client';

import { IEvent, IPublicEvent } from '@models/event';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import { className } from '@utils/common/className';
import styles from './styles.module.scss';
import { useEventHome } from '@hooks/useEventHome';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

interface EventCardProps {
  event: IPublicEvent;
  user: IUserFromCookie | null;
  currentEvent: IEvent | null;
  debtorEventId: string | null;
}

export default function EventCard(props: EventCardProps) {
  const event = props.event;
  const user = props.user;
  const eventContext = useEventHome({
    eventId: event._id,
    userId: user?.id ?? '',
    initialEvent: props.currentEvent,
    debtorEventId: props.debtorEventId,
  });

  const containerClass =
    className(styles.cardContainer, {
      [styles[eventContext.userStatusInEvent]]: true,
    })?.className ?? styles.cardContainer;

  return (
    <div className={containerClass}>
      <CardHeader event={event} userStatus={eventContext.userStatusInEvent} currentEvent={eventContext.currentEvent} />

      <CardBody event={event} currentEvent={eventContext.currentEvent} />

      <CardFooter
        event={event}
        user={user}
        userStatus={eventContext.userStatusInEvent}
        isUserIntoEvent={eventContext.isUserIntoEvent}
        handleParticipation={eventContext.handleParticipation}
        handleInfo={eventContext.handleInfo}
        isLoading={eventContext.isLoading}
      />
    </div>
  );
}
