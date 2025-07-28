'use client';

import { IPublicEvent } from '@models/event';
import { IUserFromCookie } from '@utils/localeCookies';
import { EventStatus } from '@hooks/useEvent';
import Button, { ButtonKind } from '@components/micro/Button';
import StarRating from '@components/micro/StarRating';
import { EventStatesEnum } from 'enums/EventState.enum';
import styles from './styles.module.scss';

interface CardFooterProps {
  event: IPublicEvent;
  user: IUserFromCookie | null;
  userStatus: EventStatus;
  isUserIntoEvent: boolean;
  handleParticipation: () => void;
  handleInfo: () => void;
  t: Record<string, string>;
}

export default function CardFooter(props: CardFooterProps) {
  const isRated = props.event.state === EventStatesEnum.FINISHED || props.event.state === EventStatesEnum.CLOSED;

  return (
    <section className={styles.cardFooter}>
      {props.user && !props.isUserIntoEvent && props.userStatus === EventStatus.AVAILABLE && (
        <div className={styles.participationBtn}>
          <Button
            kind={ButtonKind.SECONDARY}
            size="small"
            id="participateBtn"
            style={{ fontSize: '14px' }}
            onClick={e => {
              e.preventDefault();
              props.handleParticipation();
            }}>
            {props.t.participateBtn}
          </Button>
        </div>
      )}

      <div className={styles.infoBtn}>
        <Button
          kind={props.userStatus === EventStatus.BLOCKED ? ButtonKind.TERTIARY : ButtonKind.SECONDARY}
          size="small"
          id="infoBtn"
          onClick={e => {
            if (props.userStatus !== EventStatus.BLOCKED) {
              e.preventDefault();
              props.handleInfo();
            }
          }}>
          {props.t.infoBtn}
        </Button>
      </div>

      {isRated && (
        <section className={styles.ratingSection}>
          <StarRating rating={props.event.ratings.avgScore} />

          {props.event.ratings.ratingsAmount > 0 && <p className={styles.ratingAvg}>{Number(props.event.ratings.avgScore).toFixed(1)}</p>}

          <span className={styles.ratingRatingsAmoung}>
            ({props.event.ratings.ratingsAmount} {props.event.ratings.ratingsAmount === 1 ? props.t.reviewText : props.t.reviewTexts})
          </span>
        </section>
      )}
    </section>
  );
}
