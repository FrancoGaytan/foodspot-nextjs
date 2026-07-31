'use client';
import { IEvent } from '@models/event';
import styles from './styles.module.scss';
import { EventStatesEnum } from 'enums/EventState.enum';
import AssignBtn from './AssignBtn/AssignBtn';
import { isUserIntoEvent } from '../EventBtns/eventBtnsActions';
import { editRolesAction, getEventByIdAction, getUserByIdAction } from 'app/[lang]/event/actions';
import { useTranslation } from '@hooks/useTranslation';
import { useEffect, useState } from 'react';
import { IPublicUser, IUser } from '@models/user';
import { showToast, ToastType } from '@utils/services/toastService';

interface ResponsibilitiesDataProps {
  event: IEvent;
  userId: string | undefined;
}
export default function ResponsibilitiesData(props: ResponsibilitiesDataProps) {
  const { t } = useTranslation('eventHome');
  const [user, setUser] = useState<IPublicUser>();
  const [event, setEvent] = useState<IEvent>(props.event);

  function isUserShoppingDesignee() {
    return event.shoppingDesignee.some(designee => designee._id === props.userId);
  }

  function showAssignMeAsChefBtn(): boolean {
    return Boolean(user && !event.chef && event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent(event, user));
  }

  function showUnassignMeAsChefBtn(): boolean {
    return Boolean(user && event.chef && event.chef?._id === user?._id && event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent(event, user));
  }

  function showUnassignMeAsSDBtn(): boolean {
    return Boolean(
      user &&
        event.shoppingDesignee.length &&
        event.state === EventStatesEnum.AVAILABLE &&
        isUserIntoEvent(event, user) &&
        event.shoppingDesignee.find(sd => sd._id === user?._id)
    );
  }

  function showAssignMeAsSDBtn(): boolean {
    return Boolean(user && !event.shoppingDesignee.length && event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent(event, user));
  }

  function showAddMeAsSDBtn(): boolean {
    return Boolean(
      user &&
        event.shoppingDesignee.length > 0 &&
        event.state === EventStatesEnum.AVAILABLE &&
        isUserIntoEvent(event, user) &&
        !event.shoppingDesignee.some((d: IUser) => d._id === user?._id)
    );
  }

  function toogleShopDesignee() {
    if (!event || !user) return;
    const currentDesignees = event.shoppingDesignee || [];
    const isUserAlreadyDesignee = currentDesignees.some((designee: IPublicUser) => designee._id === user._id);

    let updatedDesignees: IPublicUser[];
    if (isUserAlreadyDesignee) {
      updatedDesignees = currentDesignees.filter((designee: IPublicUser) => designee._id !== user._id);
    } else {
      updatedDesignees = [...currentDesignees, user];
    }

    editRolesAction(event._id, { ...event, shoppingDesignee: updatedDesignees, isPrivate: event.isPrivate ?? false })
      .then(() => {
        showToast(`${t.userResponsabilityChange}!`, ToastType.SUCCESS);
      })
      .catch(() => showToast(`${t.userResponsabilityFailure}`, ToastType.ERROR))
      .finally(() => refetchEvent());
  }

  function refetchEvent(): void {
    if (!event) return;

    getEventByIdAction(event._id)
      .then(res => setEvent(res))
      .catch(err => {
        console.error('Error refreshing event:', err);
      });
  }

  function toogleChef(): void {
    if (!event) return;
    if (!event.chef) {
      editRolesAction(event._id, { ...event, chef: user ?? null, isPrivate: event.isPrivate ?? false })
        .then(() => {
          showToast(t.userResponsabilityChange, ToastType.SUCCESS);
        })
        .catch(() => showToast(`${t.userResponsabilityFailure}`, ToastType.ERROR))
        .finally(() => refetchEvent());
    } else {
      editRolesAction(event._id, { ...event, chef: null, isPrivate: event.isPrivate ?? false })
        .then(() => {
          showToast(`${t.userResponsabilityChange}!`, ToastType.SUCCESS);
        })
        .catch(() => showToast(`${t.userResponsabilityFailure}`, ToastType.ERROR))
        .finally(() => refetchEvent());
    }
  }

  useEffect(() => {
    getUserByIdAction(props.userId as string)
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
          {event.chef ? (event.chef?._id === props.userId ? t.me : event.chef.name) : t.empty}
        </h5>
        <div className={styles.assignTransitionWrapper}>
          {showUnassignMeAsChefBtn() && <AssignBtn key={`unassign-${props.userId}`} kind="unAssign" onClick={() => toogleChef()}></AssignBtn>}

          {showAssignMeAsChefBtn() && <AssignBtn key={`assign-${props.userId}`} kind="assign" onClick={() => toogleChef()}></AssignBtn>}
        </div>
      </div>
      <div className={styles.shoppingDesigneeSection}>
        <h5 className={styles.infoData}>
          {t.buyer}
          {event.shoppingDesignee.length === 0
            ? t.empty
            : isUserShoppingDesignee() || (user && !isUserIntoEvent(event, user))
              ? t.assignedOpt
              : event.state === EventStatesEnum.AVAILABLE && t.addmeOpt}
        </h5>
        <div className={styles.assignTransitionWrapper}>
          {showUnassignMeAsSDBtn() && <AssignBtn key="unassign" kind="unAssign" onClick={() => toogleShopDesignee()}></AssignBtn>}
          {showAssignMeAsSDBtn() && <AssignBtn key="assign" kind="assign" onClick={() => toogleShopDesignee()}></AssignBtn>}
          {showAddMeAsSDBtn() && <AssignBtn key="addme" kind="add" onClick={() => toogleShopDesignee()}></AssignBtn>}
        </div>
      </div>
      <div className={styles.shoppingDesigneeListSection}>
        {event.shoppingDesignee.length
          ? event.shoppingDesignee.map((designee: IUser) => (
              <div key={designee._id} className={styles.singleDesigneeSection}>
                <h5>{designee._id === user?._id ? t.meOpt : designee.name}</h5>
              </div>
            ))
          : ''}
      </div>
    </div>
  );
}
