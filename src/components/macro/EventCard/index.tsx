'use client';

import { IPublicEvent } from '@models/event';
import { IUserFromCookie } from '@utils/localeCookies';
import { className } from '@utils/className';
import styles from './styles.module.scss';
import { useEvent } from '@hooks/useEvent';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

interface EventCardProps {
  event: IPublicEvent;
  user: IUserFromCookie | null;
}

export default function EventCard(props: EventCardProps) {
  const event = props.event;
  const user = props.user;
  const eventContext = useEvent({
    eventId: event._id,
    userId: user?.id ?? '',
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
