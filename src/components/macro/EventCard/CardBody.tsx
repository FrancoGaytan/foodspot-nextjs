'use client';

import { IEvent, IPublicEvent } from '@models/event';
import Tooltip from '@components/micro/Tooltip/Tooltip';
import { parseMinutes } from '@utils/utilities';
import styles from './styles.module.scss';

interface CardBodyProps {
  event: IPublicEvent;
  t: Record<string, string>;
  currentEvent: IEvent | null;
}

export default function CardBody(props: CardBodyProps) {
  const evDate = new Date(props.event.datetime);
  const evTimeStr = `${evDate.getHours() + 3}:${parseMinutes(evDate.getMinutes().toString())}`;

  return (
    <section className={styles.cardBody}>
      <div className={styles.eventTime}>{evTimeStr} hrs</div>

      <section className={styles.mainRow}>
        <div className={styles.eventTitle}>{props.event.title}</div>

        {props.currentEvent?.isPrivate && (
          <Tooltip infoText={props.t.privateEvent}>
            <div className={styles.privateLogo}></div>
          </Tooltip>
        )}
      </section>

      <div className={styles.eventDescription}>{props.event.description}</div>

      <div className={styles.eventParticipants}>
        {props.t.currentParticipants}
        <p className={styles.participantsCount}>
          {props.event.members}/{props.event.memberLimit}
        </p>
      </div>

      <div className={styles.eventCook}>
        {props.t.cook} <p className={styles.chef}>{props.event.chef}</p>
      </div>
    </section>
  );
}
