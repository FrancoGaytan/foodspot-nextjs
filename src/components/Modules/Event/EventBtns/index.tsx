import Button, { ButtonKind } from '@components/UI/Button';
import styles from '../styles.module.scss';
import { getTranslation } from '@utils/common/getTranslation';

interface EventBtnsProps {
  showBtns: {
    payBtn: boolean;
    closeBtn: boolean;
    reopenBtn: boolean;
    deleteBtn: boolean;
    participateBtn: boolean;
    quitBtn: boolean;
    newPurchaseReceiptBtn: boolean;
    readyToPayBtn: boolean;
    modifyPayBtn: boolean;
  };
}

export default async function EventBtns(props: EventBtnsProps) {
  const { t } = await getTranslation('eventHome');
  return (
    <section className={styles.btnSection}>
      {props.showBtns.payBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
          {t.payBtn}
        </Button>
      )}
      {props.showBtns.closeBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.closeEventBtn}
        </Button>
      )}
      {props.showBtns.reopenBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.reopenEventBtn}
        </Button>
      )}
      {props.showBtns.deleteBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.deleteEventBtn}
        </Button>
      )}
      {props.showBtns.participateBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
          {t.participationBtn}
        </Button>
      )}
      {props.showBtns.quitBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.quitEventBtn}
        </Button>
      )}

      {props.showBtns.readyToPayBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.readyforpayment}
        </Button>
      )}
      {props.showBtns.modifyPayBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.SECONDARY} size="short">
          {t.modifyPay}
        </Button>
      )}
      {props.showBtns.newPurchaseReceiptBtn && (
        <Button className={styles.btnEvent} kind={ButtonKind.PRIMARY} size="short">
          {t.loadPurchase}
        </Button>
      )}
    </section>
  );
}
