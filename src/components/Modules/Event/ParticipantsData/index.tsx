'use client';
import { getMembersAmount, getMembersAndReceiptsInfo } from '@services/eventService';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { EventUserResponse, IPublicUser, IUser } from '@models/user';
import { useTranslation } from '@hooks/useTranslation';
import { IEvent } from '@models/event';
import { EventStatesEnum } from 'enums/EventState.enum';
import { getUserById } from '@services/userService';
import { PayCheckInfoResponse } from '@models/transfer';
import Button, { ButtonKind } from '@components/UI/Button';
import { useModal } from '@contexts/ModalContext';
import FastAprovalForm from '@components/Modules/FastApprovalForm';
import ConfirmationPayForm from '@components/Modules/ConfirmationPayForm';

interface ParticipantsDataProps {
  event: IEvent;
  userId: string | undefined;
}

export default function ParticipantsData(props: ParticipantsDataProps) {
  const { t } = useTranslation('eventHome');
  const [user, setUser] = useState<IPublicUser>();
  const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);
  const [totalPaymentInfo, setTotalPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
/*   const [paymentInfo, setPaymentInfo] = useState({ amount: 0, receiver: {} as IUserReceiverInfo }); */
  const { open, close } = useModal();

  function showPaymentData() {
    if (!props.event) return false;
    return (
      props.event.state === EventStatesEnum.READY_FOR_PAYMENT &&
      props.event.shoppingDesignee &&
      props.event.shoppingDesignee.some((d: IUser) => d._id === user?._id)
    );
  }

  function currentUserHasNoDebts(member: EventUserResponse) {
    return totalPaymentInfo.find((user: PayCheckInfoResponse) => user.userId === member.userId && user.amount === 0);
  }

  function currentUserPaysHasToPayMe(member: EventUserResponse) {
    return totalPaymentInfo.find(
      (userFinding: PayCheckInfoResponse) => userFinding.userId === member.userId && userFinding.receiver?.receiverId === user?._id
    );
  }

  function refetchMembersAndReceiptInfo() {
    if (!props.event) return;
    const abortController = new AbortController();
    getMembersAndReceiptsInfo(props.event._id, abortController.signal)
      .then(res => {
        setEventParticipants(res);
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }

  function openConfirmationPayForm(transferReceiptId: string | undefined, userToApprove: string) {
    open(
      <div style={{ padding: 32, textAlign: 'center' }}>
        {user && <ConfirmationPayForm event={props.event} transferReceiptId={transferReceiptId} userToApprove={userToApprove} closeModal={close} refetchEvent={refetchMembersAndReceiptInfo}/>}
      </div>,
      { title: 'Validate Payment' }
    );
  }

  function openModalFastAproval(userId: string) {
    open(
      <div style={{ padding: 32, textAlign: 'center' }}>
        {user && (
          <FastAprovalForm eventId={props.event._id} userId={userId} closeModal={close} refetchMembersAndReceiptInfo={refetchMembersAndReceiptInfo} />
        )}
      </div>,
      { title: 'Fast Approval' }
    );
  }

  useEffect(() => {
    getUserById(props.userId)
      .then(res => setUser(res))
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.userId]);

  useEffect(() => {
    if (!props.event) {
      return;
    }
    const abortController = new AbortController();
    getMembersAndReceiptsInfo(props.event._id, abortController.signal)
      .then(res => {
        setEventParticipants(res);
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.event]);

  useEffect(() => {
    if (!props.event) {
      return;
    }
    const abortController = new AbortController();
    getMembersAmount(props.event?._id, abortController.signal)
      .then(res => {
/*         const myInfo = res.find((member: PayCheckInfoResponse) => member.userId === user?._id); */
        setTotalPaymentInfo(res);
/*         if (myInfo?.amount === 0) {
          setPaymentInfo({ amount: 0, receiver: {} as IUserReceiverInfo });
        } else {
          setPaymentInfo({ amount: myInfo?.amount ?? 0, receiver: myInfo?.receiver ?? ({} as IUserReceiverInfo) });
        } */
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.event, user?._id]);

  return (
    <div className={styles.participantsDataContent}>
      <section className={styles.participantsDataTitle}>
        <div className={styles.participantsLogo}></div>
        <h3 className={styles.logoTitle}>
          {t.diners}
          {props.event.members.length}/{props.event.memberLimit}
        </h3>
      </section>
      <section className={styles.eventParticipants}>
        {eventParticipants.map((member: EventUserResponse, i: number) => (
          <div key={`participants-key-${i}`} className={styles.infoDataRow}>
            <h5 className={styles.infoDataUsername}>
              {member.userName} {member.userLastName}
            </h5>
            {showPaymentData() && (
              <>
                {member.hasReceiptApproved || currentUserHasNoDebts(member) ? (
                  <h5 className={styles.infoDataUsernamePayed}>{t.paidNoti}</h5>
                ) : member.hasUploaded ? (
                  currentUserPaysHasToPayMe(member) ? (
                    <Button
                      className={styles.btnEvent}
                      kind={ButtonKind.VALIDATION}
                      size="micro"
                      onClick={e => {
                        e.preventDefault();
                        openConfirmationPayForm(member.transferReceipt as string, member.userId);
                      }}>
                      {t.validateBtn}
                    </Button>
                  ) : (
                    <h5 className={styles.waitingValidationPay}>{t.awaitingNoti}</h5>
                  )
                ) : (
                  <>
                    <h5 className={styles.infoDataUsernameDidntPay}>{t.pendingNoti}</h5>
                    {currentUserPaysHasToPayMe(member) && (
                      <button
                        className={styles.fastAproveBtn}
                        onClick={e => {
                          e.preventDefault();
                          openModalFastAproval(member.userId);
                        }}></button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
