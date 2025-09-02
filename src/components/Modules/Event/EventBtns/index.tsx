'use client';

import Button, { ButtonKind } from '@components/UI/Button';
import styles from '../styles.module.scss';
import { IEvent } from '@models/event';
import { getMembersAmount, getMembersAndReceiptsInfo } from '@services/eventService';
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
import { getUserById } from '@services/userService';
import { IPublicUser } from '@models/user';
import { useEffect, useState } from 'react';
import { useTranslation } from '@hooks/useTranslation';

interface EventBtnsProps {
  event: IEvent;
  user: IUserFromCookie;
}

export default function EventBtns(props: EventBtnsProps) {
  const { t } = useTranslation('eventHome');
  const [user, setUser] = useState<IPublicUser | null>(null);
  const [eventPaymentInfo, setEventPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
  const [eventParticipantsInfo, setEventParticipantsInfo] = useState<ITransferReceiptInfoResponse[]>([]);
  const myInfo = eventPaymentInfo.find((member: PayCheckInfoResponse) => member.userId === props.user.id);

  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUserById(props.user.id);
      setUser(fetchedUser);
    }
    fetchUser();
  }, [props.user.id]);

  useEffect(() => {
    async function fetchEventParticipantsInfo() {
      const fetchedEventParticipantsInfo = await getMembersAndReceiptsInfo(props.event._id);
      setEventParticipantsInfo(fetchedEventParticipantsInfo);
    }
    fetchEventParticipantsInfo();
  }, [props.event._id]);

  useEffect(() => {
    async function fetchEventPaymentInfo() {
      const fetchedEventPaymentInfo = await getMembersAmount(props.event._id);
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
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.closeEventBtn}
            </Button>
          )}
          {showReopenEventBtn(props.event, user) && (
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.reopenEventBtn}
            </Button>
          )}
          {showDeleteEventBtn(props.event, user) && (
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.deleteEventBtn}
            </Button>
          )}
          {showParticipationBtn(props.event, user) && (
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
              {t.participateBtn}
            </Button>
          )}
          {showQuitEventBtn(props.event, user) && (
            <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
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
