'use client';

import { IEvent, IPublicEvent } from '@models/event';
import { EventStatus } from '@hooks/useEvent';
import { className } from '@utils/common/className';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';

interface CardHeaderProps {
  event: IPublicEvent;
  userStatus: EventStatus;
  currentEvent: IEvent | null;
}

export default function CardHeader(props: CardHeaderProps) {
  const { t } = useTranslation('eventHome');
  const evDate = new Date(props.event.datetime);
  const evDateStr = `${evDate.getDate()}. ${evDate.getMonth() + 1}. ${evDate.getFullYear()}.`;
  const statusLabel = t[props.userStatus] ?? '';

  return (
    <section className={styles.cardHeader}>
      <div className={className(styles.stateTab, { [styles[props.userStatus]]: true })?.className ?? styles.stateTab}>
        {statusLabel.toUpperCase()}
      </div>
      <div className={className(styles.dateSection, { [styles[props.userStatus]]: true })?.className ?? styles.dateSection}>{evDateStr}</div>
    </section>
  );
}
