'use client';

import { IPublicEvent } from '@models/event';
import { IUserFromCookie } from '@utils/localeCookies';
import { className } from '@utils/className';
import styles from './styles.module.scss';

import { useEvent } from '@hooks/useEvent';
import { useTranslation } from '@hooks/useTranslation';

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

  const { t } = useTranslation('eventHome');

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
      <CardHeader event={event} userStatus={eventContext.userStatusInEvent} currentEvent={eventContext.currentEvent} t={t} />

      <CardBody event={event} currentEvent={eventContext.currentEvent} t={t} />

      <CardFooter
        event={event}
        user={user}
        userStatus={eventContext.userStatusInEvent}
        isUserIntoEvent={eventContext.isUserIntoEvent}
        handleParticipation={eventContext.handleParticipation}
        handleInfo={eventContext.handleInfo}
        t={t}
      />
    </div>
  );
}
