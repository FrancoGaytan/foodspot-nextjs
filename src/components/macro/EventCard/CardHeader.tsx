'use client';

import { IEvent, IPublicEvent } from '@models/event';
import { EventStatus } from '@hooks/useEvent';
import { className } from '@utils/className';
import styles from './styles.module.scss';

interface CardHeaderProps {
  event: IPublicEvent;
  userStatus: EventStatus;
  t: Record<string, string>;
  currentEvent: IEvent | null;
}

export default function CardHeader(props: CardHeaderProps) {
  const evDate = new Date(props.event.datetime);
  const evDateStr = `${evDate.getDate()}. ${evDate.getMonth() + 1}. ${evDate.getFullYear()}.`;
  const statusLabel = props.t[props.userStatus] ?? '';

  return (
    <section className={styles.cardHeader}>
      <div className={className(styles.stateTab, { [styles[props.userStatus]]: true })?.className ?? styles.stateTab}>
        {statusLabel.toUpperCase()}
      </div>
      <div className={className(styles.dateSection, { [styles[props.userStatus]]: true })?.className ?? styles.dateSection}>{evDateStr}</div>
    </section>
  );
}
