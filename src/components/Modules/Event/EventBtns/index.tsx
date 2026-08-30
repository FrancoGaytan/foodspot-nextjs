'use client';

import Button, { ButtonKind } from '@components/UI/Button';
import styles from '../styles.module.scss';
import { IEvent } from '@models/event';
import { getMembersAmountAction, getMembersAndReceiptsInfoAction, getUserByIdAction } from 'app/[lang]/event/actions';
import { ITransferReceiptInfoResponse, PayCheckInfoResponse } from '@models/transfer';
import {
  showCloseEventBtn,
  showDeleteEventBtn,
  showModifyPayBtn,
  showNewPurchaseReceiptBtn,
  showParticipationBtn,
  showPayBtn,
  showQuitEventBtn,
  showReadyToPayBtn,
  showReopenEventBtn,
} from './eventBtnsActions';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import { IPublicUser } from '@models/user';
import { useEffect, useState } from 'react';
import { useTranslation } from '@hooks/useTranslation';
import { useRouter } from 'next/navigation';
import {
  deleteEventAction,
  editEventAction,
  subscribeToAnEventAction,
  unsubscribeFromEventAction,
} from 'app/[lang]/event/actions';
import { EventStatesEnum } from 'enums/EventState.enum';
import { showToast, ToastType } from '@utils/services/toastService';

interface EventBtnsProps {
  event: IEvent;
  user: IUserFromCookie;
}

export default function EventBtns(props: EventBtnsProps) {
  const { t } = useTranslation('eventHome');
  const router = useRouter();
  const [user, setUser] = useState<IPublicUser | null>(null);
  const [eventPaymentInfo, setEventPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
  const [eventParticipantsInfo, setEventParticipantsInfo] = useState<ITransferReceiptInfoResponse[]>([]);
  const myInfo = eventPaymentInfo.find((member: PayCheckInfoResponse) => member.userId === props.user.id);

  async function updateEventState(state: EventStatesEnum): Promise<void> {
    try {
      await editEventAction(props.event._id, { ...props.event, state });
      showToast(state === EventStatesEnum.CLOSED ? t.eventClosed : t.eventOpen, ToastType.SUCCESS);
      router.refresh();
    } catch {
      showToast(t.eventClosingFailure, ToastType.ERROR);
    }
  }

  async function participate(): Promise<void> {
    try {
      await subscribeToAnEventAction(props.user.id, props.event._id);
      showToast(t.userAddedSuccessfully, ToastType.SUCCESS);
      router.refresh();
    } catch {
      showToast(t.userAddingFailure, ToastType.ERROR);
    }
  }

  async function quit(): Promise<void> {
    try {
      await unsubscribeFromEventAction(props.user.id, props.event._id);
      showToast(t.userRemovedSuccessfully, ToastType.SUCCESS);
      router.refresh();
    } catch {
      showToast(t.userRemovingFailure, ToastType.ERROR);
    }
  }

  async function removeEvent(): Promise<void> {
    try {
      await deleteEventAction(props.event._id);
      showToast(t.eventDeleted, ToastType.SUCCESS);
      router.push('/eventHome');
    } catch {
      showToast(t.eventDeletingFailure, ToastType.ERROR);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUserByIdAction(props.user.id);
      setUser(fetchedUser);
    }
    fetchUser();
  }, [props.user.id]);

  useEffect(() => {
    async function fetchEventParticipantsInfo() {
      const fetchedEventParticipantsInfo = await getMembersAndReceiptsInfoAction(props.event._id);
      setEventParticipantsInfo(fetchedEventParticipantsInfo);
    }
    fetchEventParticipantsInfo();
  }, [props.event._id]);

  useEffect(() => {
    async function fetchEventPaymentInfo() {
      const fetchedEventPaymentInfo = await getMembersAmountAction(props.event._id);
      setEventPaymentInfo(fetchedEventPaymentInfo);
    }
    fetchEventPaymentInfo();
  }, [props.event._id]);


  return (
    <section className={styles.btnSection}>
      {user && (
        <>
          {' '}
          {showPayBtn(props.event, user, eventParticipantsInfo, myInfo) && (
            <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
              {t.payBtn}
            </Button>
          )}
          {showCloseEventBtn(props.event, user) && (
            <Button onClick={() => updateEventState(EventStatesEnum.CLOSED)} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.closeEventBtn}
            </Button>
          )}
          {showReopenEventBtn(props.event, user) && (
            <Button onClick={() => updateEventState(EventStatesEnum.AVAILABLE)} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.reopenEventBtn}
            </Button>
          )}
          {showDeleteEventBtn(props.event, user) && (
            <Button onClick={removeEvent} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.deleteEventBtn}
            </Button>
          )}
          {showParticipationBtn(props.event, user) && (
            <Button onClick={participate} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.participateBtn}
            </Button>
          )}
          {showQuitEventBtn(props.event, user) && (
            <Button onClick={quit} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.getOff}
            </Button>
          )}
          {showReadyToPayBtn(props.event, user) && (
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.READY_FOR_PAYMENT}
            </Button>
          )}
          {showModifyPayBtn(props.event, user, eventParticipantsInfo, myInfo) && (
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.modifyPay}
            </Button>
          )}
          {showNewPurchaseReceiptBtn(props.event, user) && (
            <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
              {t.loadPurchase}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
