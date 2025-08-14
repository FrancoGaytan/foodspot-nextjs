'use client';

import { IPublicEvent } from '@models/event';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import { EventStatus } from '@hooks/useEventHome';
import Button, { ButtonKind } from '@components/UI/Button';
import StarRating from '@components/UI/StarRating';
import { EventStatesEnum } from 'enums/EventState.enum';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';

interface CardFooterProps {
  event: IPublicEvent;
  user: IUserFromCookie | null;
  userStatus: EventStatus;
  isUserIntoEvent: boolean;
  handleParticipation: () => void;
  handleInfo: () => void;
  isLoading: boolean;
}

export default function CardFooter(props: CardFooterProps) {
  const isRated = props.event.state === EventStatesEnum.FINISHED || props.event.state === EventStatesEnum.CLOSED;
  const { t } = useTranslation('eventHome');

  return (
    <section className={styles.cardFooter}>
      {!props.isLoading && props.user && !props.isUserIntoEvent && props.userStatus === EventStatus.AVAILABLE && (
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
            {t.participateBtn}
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
          {t.infoBtn}
        </Button>
      </div>

      {!props.isLoading && isRated && (
        <section className={styles.ratingSection}>
          <StarRating rating={props.event.ratings.avgScore} />

          {props.event.ratings.ratingsAmount > 0 && <p className={styles.ratingAvg}>{Number(props.event.ratings.avgScore).toFixed(1)}</p>}

          <span className={styles.ratingRatingsAmoung}>
            ({props.event.ratings.ratingsAmount} {props.event.ratings.ratingsAmount === 1 ? t.reviewText : t.reviewTexts})
          </span>
        </section>
      )}
    </section>
  );
}
