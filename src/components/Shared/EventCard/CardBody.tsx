'use client';

import { IEvent, IPublicEvent } from '@models/event';
import Tooltip from '@components/UI/Tooltip/Tooltip';
import { parseMinutes } from '@utils/common/utilities';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';

interface CardBodyProps {
  event: IPublicEvent;
  currentEvent: IEvent | null;
}

export default function CardBody(props: CardBodyProps) {
  const { t } = useTranslation('eventHome');
  const evDate = new Date(props.event.datetime);
  const evTimeStr = `${evDate.getHours() + 3}:${parseMinutes(evDate.getMinutes().toString())}`;

  return (
    <section className={styles.cardBody}>
      <div className={styles.eventTime}>{evTimeStr} hrs</div>

      <section className={styles.mainRow}>
        <div className={styles.eventTitle}>{props.event.title}</div>

        {props.currentEvent?.isPrivate && (
          <Tooltip infoText={t.privateEvent}>
            <div className={styles.privateLogo}></div>
          </Tooltip>
        )}
      </section>

      <div className={styles.eventDescription}>{props.event.description}</div>

      <div className={styles.eventParticipants}>
        {t.currentParticipants}
        <p className={styles.participantsCount}>
          {props.event.members}/{props.event.memberLimit}
        </p>
      </div>

      <div className={styles.eventCook}>
        {t.cook} <p className={styles.chef}>{props.event.chef}</p>
      </div>
    </section>
  );
}
