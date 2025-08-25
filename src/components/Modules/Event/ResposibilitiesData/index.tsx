'use client';
import { IEvent } from '@models/event';
import styles from './styles.module.scss';
import { EventStatesEnum } from 'enums/EventState.enum';
import AssignBtn from './AssignBtn/AssignBtn';
import { isUserIntoEvent } from '../EventBtns/eventBtnsActions';
import { getUserById } from '@services/userService';
import { useTranslation } from '@hooks/useTranslation';
import { useEffect, useState } from 'react';
import { IPublicUser } from '@models/user';

interface ResponsibilitiesDataProps {
  event: IEvent;
  userId: string | undefined;
}
export default function ResponsibilitiesData(props: ResponsibilitiesDataProps) {
  const { t } = useTranslation('eventHome');
  const [user, setUser] = useState<IPublicUser>();

  useEffect(() => {
    getUserById(props.userId)
      .then(res => setUser(res))
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.userId]);

  return (
    <div className={styles.responsibilitiesContainer}>
      <section className={styles.eventResponsibilitiesTitle}>
        <div className={styles.inChargeLogo}></div>
        <h3 className={styles.logoTitle}>{t.inchargeTitle}</h3>
      </section>
      <div className={styles.chefDesigneeSection}>
        <h5 className={styles.infoData}>
          {t.cook}
          {props.event.chef ? (props.event.chef?._id === props.userId ? t.me : props.event.chef.name) : t.empty}
        </h5>
        <div className={styles.assignTransitionWrapper}>
          <AssignBtn key={`unassign-${props.userId}`} kind="unAssign" onClick={() => {}}></AssignBtn>
          {user &&
            props.event.chef &&
            props.event.chef?._id === props.userId &&
            props.event.state === EventStatesEnum.AVAILABLE &&
            isUserIntoEvent(props.event, user) && (
              <AssignBtn key={`unassign-${props.userId}`} kind="unAssign" onClick={() => console.log()}></AssignBtn>
            )}

          {user && !props.event.chef && props.event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent(props.event, user) && (
            <AssignBtn key={`assign-${props.userId}`} kind="assign" onClick={() => console.log()}></AssignBtn>
          )}
        </div>
      </div>
    </div>
  );
}
