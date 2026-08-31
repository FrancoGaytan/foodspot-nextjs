'use client';
import { getMembersAmountAction, getMembersAndReceiptsInfoAction, getUserByIdAction } from 'app/[lang]/event/actions';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { EventUserResponse, IPublicUser, IUser } from '@models/user';
import { useTranslation } from '@hooks/useTranslation';
import { IEvent } from '@models/event';
import { EventStatesEnum } from 'enums/EventState.enum';
import { PayCheckInfoResponse } from '@models/transfer';
import Button, { ButtonKind } from '@components/UI/Button';
import { useModal } from '@contexts/ModalContext';
import FastApprovalModal from './Modals/FastApprovalModal';
import ConfirmationPayModal from './Modals/ConfirmationPayModal';
import FoodSurvey from '../FoodSurvey';
import { isUserIntoEvent, userIsAShoppingDesignee, userIsTheOrganizer } from '../EventBtns/eventBtnsActions';

interface ParticipantsDataProps {
  event: IEvent;
  userId: string | undefined;
}

export default function ParticipantsData(props: ParticipantsDataProps) {
  const { t } = useTranslation('eventHome');
  const [user, setUser] = useState<IPublicUser>();
  const [eventParticipants, setEventParticipants] = useState<EventUserResponse[]>([]);
  const [totalPaymentInfo, setTotalPaymentInfo] = useState<PayCheckInfoResponse[]>([]);
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
    getMembersAndReceiptsInfoAction(props.event._id)
      .then(res => {
        setEventParticipants(res);
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }

  function openConfirmationPayForm(transferReceiptId: string | undefined, userToApprove: string) {
    open(
      <ConfirmationPayModal
        event={props.event}
        transferReceiptId={transferReceiptId}
        userToApprove={userToApprove}
        closeModal={close}
        refetchEvent={refetchMembersAndReceiptInfo}
        user={user}
      />,
      { title: t.validatePaymentTitle }
    );
  }

  function openModalFastAproval(userId: string) {
    open(
      <FastApprovalModal eventId={props.event._id} userId={userId} closeModal={close} refetchMembersAndReceiptInfo={refetchMembersAndReceiptInfo} />,
      { title: t.fastApprovalTitle }
    );
  }

  function openSurvey(): void {
    if (!user) return;
    open(
      <FoodSurvey
        eventId={props.event._id}
        userId={user._id}
        options={props.event.options ?? []}
        canEdit={userIsTheOrganizer(props.event, user) || userIsAShoppingDesignee(props.event, user)}
        closeModal={close}
      />,
      { title: t.surveyBtn }
    );
  }

  useEffect(() => {
    getUserByIdAction(props.userId as string)
      .then(res => setUser(res))
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.userId]);

  useEffect(() => {
    if (!props.event) {
      return;
    }
    getMembersAndReceiptsInfoAction(props.event._id)
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
    getMembersAmountAction(props.event?._id)
      .then(res => {
        setTotalPaymentInfo(res);
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
        {user && props.event.state === EventStatesEnum.AVAILABLE && isUserIntoEvent(props.event, user) && (
          <Button type="button" className={styles.surveyButton} kind={ButtonKind.TERTIARY} size="small" onClick={openSurvey} aria-label={t.surveyBtn} title={t.surveyBtn}>
            <span className="material-icons" aria-hidden>restaurant_menu</span>
          </Button>
        )}
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
