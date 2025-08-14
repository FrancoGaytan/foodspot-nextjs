import Button, { ButtonKind } from '@components/UI/Button';
import styles from '../styles.module.scss';
import { getTranslation } from '@utils/common/getTranslation';
import { IEvent } from '@models/event';
import { getMembersAmount, getMembersAndReceiptsInfo } from '@services/eventServiceServer';
import { PayCheckInfoResponse } from '@models/transfer';
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
import { getUserById } from '@services/userServiceServer';

interface EventBtnsProps {
  event: IEvent;
  user: IUserFromCookie;
}

export default async function EventBtns(props: EventBtnsProps) {
  const eventPaymentInfo = await getMembersAmount(props.event._id);
  const eventParticipantsInfo = await getMembersAndReceiptsInfo(props.event._id);
  const user = await getUserById(props.user.id);
  const myInfo = eventPaymentInfo.find((member: PayCheckInfoResponse) => member.userId === props.user.id);

  const { t } = await getTranslation('eventHome');
  return (
    <section className={styles.btnSection}>
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
        <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
          {t.participationBtn}
        </Button>
      )}
      {showQuitEventBtn(props.event, user) && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.quitEventBtn}
        </Button>
      )}

      {showReadyToPayBtn(props.event, user) && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.readyforpayment}
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
    </section>
  );
}
