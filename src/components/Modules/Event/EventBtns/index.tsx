'use client';

import Button, { ButtonKind } from '@components/UI/Button';
import Spinner from '@components/UI/Spinner';
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
  userIsAShoppingDesignee,
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
import { useModal } from '@contexts/ModalContext';
import PaymentForm from '@components/Modules/PaymentForm';
import PurchaseReceiptForm from '@components/Modules/PurchaseReceiptForm';
import AssignationTable from '@components/Modules/Event/AssignationTable';

interface EventBtnsProps {
  event: IEvent;
  user: IUserFromCookie;
}

export default function EventBtns(props: EventBtnsProps) {
  const { t } = useTranslation('eventHome');
  const router = useRouter();
  const { open, close } = useModal();
  const [user, setUser] = useState<IPublicUser | null>(null);
  const [eventPaymentInfo, setEventPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
  const [eventParticipantsInfo, setEventParticipantsInfo] = useState<ITransferReceiptInfoResponse[]>([]);
  const [isPending, setIsPending] = useState(false);
  const myInfo = eventPaymentInfo.find((member: PayCheckInfoResponse) => member.userId === props.user.id);
  const hasPurchaseReceipts = props.event.purchaseReceipts.length > 0;
  const canLoadPaymentInfo = hasPurchaseReceipts && props.event.state === EventStatesEnum.READY_FOR_PAYMENT;

  async function updateEventState(state: EventStatesEnum): Promise<void> {
    if (isPending) return;
    if (state === EventStatesEnum.CLOSED) {
      if (props.event.shoppingDesignee.length === 0) {
        showToast(t.unassignAtClosing, ToastType.ERROR);
        return;
      }
      if (eventParticipantsInfo.some(member => member.hasReceiptApproved)) {
        showToast(t.eventWithApprovedReceiptsCannotBeReclosed, ToastType.ERROR);
        return;
      }
    }
    if (state === EventStatesEnum.READY_FOR_PAYMENT && props.event.purchaseReceipts.length === 0) {
      showToast(t.eventCantBeReadyForPaymentWithoutPurchases, ToastType.ERROR);
      return;
    }
    setIsPending(true);
    try {
      await editEventAction(props.event._id, { ...props.event, state });
      showToast(state === EventStatesEnum.CLOSED ? t.eventClosed : t.eventOpen, ToastType.SUCCESS);
      router.refresh();
    } catch {
      showToast(t.eventClosingFailure, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  async function participate(): Promise<void> {
    if (isPending) return;
    setIsPending(true);
    try {
      await subscribeToAnEventAction(props.user.id, props.event._id);
      showToast(t.userAddedSuccessfully, ToastType.SUCCESS);
      router.refresh();
    } catch {
      showToast(t.userAddingFailure, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  async function quit(): Promise<void> {
    if (isPending) return;
    if (user && userIsAShoppingDesignee(props.event, user)) {
      showToast(t.shoppingDesigneeTryingToGetOff, ToastType.ERROR);
      return;
    }
    if (props.event.purchaseReceipts.some(receipt => receipt.shoppingDesignee?._id === props.user.id)) {
      showToast(t.sdCanNotRemove, ToastType.ERROR);
      return;
    }
    setIsPending(true);
    try {
      await unsubscribeFromEventAction(props.user.id, props.event._id);
      showToast(t.userRemovedSuccessfully, ToastType.SUCCESS);
      router.refresh();
    } catch {
      showToast(t.userRemovingFailure, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  async function removeEvent(): Promise<void> {
    if (isPending) return;
    setIsPending(true);
    try {
      await deleteEventAction(props.event._id);
      showToast(t.eventDeleted, ToastType.SUCCESS);
      router.push('/eventHome');
    } catch {
      showToast(t.eventDeletingFailure, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  function refreshEvent(): void {
    router.refresh();
  }

  function openPaymentForm(): void {
    if (!myInfo) return;
    const existingReceiptId = eventParticipantsInfo.find(member => member.userId === props.user.id)?.transferReceipt ?? undefined;
    open(
      <PaymentForm event={props.event} userId={props.user.id} paymentInfo={myInfo} existingReceiptId={existingReceiptId} closeModal={close} refetchEvent={refreshEvent} />,
      { title: t.payBtn }
    );
  }

  function openPurchaseReceiptForm(): void {
    open(<PurchaseReceiptForm event={props.event} closeModal={close} refetchEvent={refreshEvent} />, { title: t.loadPurchase });
  }

  function openAssignationTable(): void {
    open(
      <AssignationTable eventId={props.event._id} userId={props.user.id} closeModal={close} />,
      { title: t.purchasesMade }
    );
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
      if (!canLoadPaymentInfo) {
        setEventParticipantsInfo([]);
        return;
      }

      try {
        const fetchedEventParticipantsInfo = await getMembersAndReceiptsInfoAction(props.event._id);
        setEventParticipantsInfo(fetchedEventParticipantsInfo);
      } catch {
        setEventParticipantsInfo([]);
      }
    }
    fetchEventParticipantsInfo();
  }, [canLoadPaymentInfo, props.event._id]);

  useEffect(() => {
    async function fetchEventPaymentInfo() {
      if (!canLoadPaymentInfo) {
        setEventPaymentInfo([]);
        return;
      }

      try {
        const fetchedEventPaymentInfo = await getMembersAmountAction(props.event._id);
        setEventPaymentInfo(fetchedEventPaymentInfo);
      } catch {
        setEventPaymentInfo([]);
      }
    }
    fetchEventPaymentInfo();
  }, [canLoadPaymentInfo, props.event._id]);


  return (
    <section className={styles.btnSection} aria-busy={isPending}>
      {user && (
        isPending ? <Spinner size={32} /> : (
        <>
          {' '}
          {showPayBtn(props.event, user, eventParticipantsInfo, myInfo) && (
              <Button disabled={isPending} onClick={openPaymentForm} className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
              {t.payBtn}
            </Button>
          )}
          {showCloseEventBtn(props.event, user) && (
            <Button disabled={isPending} onClick={() => updateEventState(EventStatesEnum.CLOSED)} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
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
            <Button onClick={() => updateEventState(EventStatesEnum.READY_FOR_PAYMENT)} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.readyforpayment}
            </Button>
          )}
          {showModifyPayBtn(props.event, user, eventParticipantsInfo, myInfo) && (
            <Button onClick={openPaymentForm} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.modifyPay}
            </Button>
          )}
          {props.event.state === EventStatesEnum.READY_FOR_PAYMENT && userIsAShoppingDesignee(props.event, user) && (
            <Button onClick={openAssignationTable} className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.purchasesMade}
            </Button>
          )}
          {showNewPurchaseReceiptBtn(props.event, user) && (
            <Button onClick={openPurchaseReceiptForm} className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
              {t.loadPurchase}
            </Button>
          )}
        </>
        )
      )}
    </section>
  );
}
