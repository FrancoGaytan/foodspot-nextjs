'use client';
import { getMembersAmount, getMembersAndReceiptsInfo } from '@services/eventService';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { EventUserResponse, IPublicUser, IUser } from '@models/user';
import { useTranslation } from '@hooks/useTranslation';
import { IEvent } from '@models/event';
import { EventStatesEnum } from 'enums/EventState.enum';
import { getUserById } from '@services/userService';
import { IUserReceiverInfo, PayCheckInfoResponse } from '@models/transfer';
import Button, { ButtonKind } from '@components/UI/Button';
import { isUserIntoEvent } from '../EventBtns/eventBtnsActions';

interface ParticipantsDataProps {
  event: IEvent;
  userId: string | undefined;
}

export default function ParticipantsData(props: ParticipantsDataProps) {
  const { t } = useTranslation('eventHome');
  const [user, setUser] = useState<IPublicUser>();
  const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);
  const [totalPaymentInfo, setTotalPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
  const [paymentInfo, setPaymentInfo] = useState({ amount: 0, receiver: {} as IUserReceiverInfo });

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

  	function checkIfUserHasUploaded() {
		const myReceipt = eventParticipants.find(member => member.userId === user?._id);
		return myReceipt?.hasUploaded;
	}

	function checkIfUserHasPaid() {
		const myReceipt = eventParticipants.find(member => member.userId === user?._id);
		return myReceipt?.hasReceiptApproved;
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
        const myInfo = res.find((member: PayCheckInfoResponse) => member.userId === user?._id);
        setTotalPaymentInfo(res);
        if (myInfo?.amount === 0) {
          setPaymentInfo({ amount: 0, receiver: {} as IUserReceiverInfo });
        } else {
          setPaymentInfo({ amount: myInfo?.amount ?? 0, receiver: myInfo?.receiver ?? ({} as IUserReceiverInfo) });
        }
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.event, user?._id]);

/*   useEffect(() => {
  if (!props.event || !props.event._id || !props.userId) return;
  const abortController = new AbortController();

  Promise.all([
    getUserById(props.userId),
    getMembersAndReceiptsInfo(props.event._id, abortController.signal),
    getMembersAmount(props.event._id, abortController.signal)
  ])
    .then(([userRes, participantsRes, paymentRes]) => {
      setUser(userRes);
      setEventParticipants(participantsRes);

      const myInfo = paymentRes.find((member: PayCheckInfoResponse) => member.userId === userRes?._id);
      setTotalPaymentInfo(paymentRes);
      if (myInfo?.amount === 0) {
        setPaymentInfo({ amount: 0, receiver: {} as IUserReceiverInfo });
      } else {
        setPaymentInfo({ amount: myInfo?.amount ?? 0, receiver: myInfo?.receiver ?? ({} as IUserReceiverInfo) });
      }
    })
    .catch(e => {
      console.error('Catch in context: ', e);
    });

  return () => {
    abortController.abort();
  };
}, [props.event, props.userId]); */

  return (
    <div className={styles.participantsDataContent}>
      <section className={styles.participantsDataTitle}>
        <div className={styles.participantsLogo}></div>
        <h3 className={styles.logoTitle}>{t.organizationTitle}</h3>
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
                      onClick={() => {
                        /* setTransferReceiptId(member.transferReceipt as string);
                     setUserToApprove(member.userId);
                     openValidationPopup(); */
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
                          /* openModalFastAproval(member.userId); */
                        }}></button>
                    )}
                  </>
                )}
              </>
            )}

            {user && props.event.shoppingDesignee &&
              props.event.state === EventStatesEnum.READY_FOR_PAYMENT &&
              isUserIntoEvent(props.event, user) &&
              paymentInfo.amount !== 0 &&
              (props.event.purchaseReceipts.length as number) !== 0 &&
              (!checkIfUserHasUploaded() ? (
                <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short" /* onClick={() => payCheck()} */>
                  {t.payBtn}
                </Button>
              ) : (
                !checkIfUserHasPaid() && (
                  <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short" /* onClick={() => payCheck()} */>
                    {t.modifyPay}
                  </Button>
                )
              ))}
          </div>
        ))}
      </section>
    </div>
  );
}
