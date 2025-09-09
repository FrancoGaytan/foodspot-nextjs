import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import { showToast, ToastType } from '@utils/services/toastService';
import { approvePaymentWithoutReceipt } from '@services/transferReceiptsService';
import styles from './styles.module.scss';

interface FastAprovalFormProps {
  eventId: string;
  userId: string;
  closeModal: () => void;
  refetchMembersAndReceiptInfo: () => void;
}

export default function FastAprovalForm(props: FastAprovalFormProps) {
  const { t } = useTranslation('event');

  async function aprovePayment(): Promise<void> {
    const abortController = new AbortController();
    try {
      await approvePaymentWithoutReceipt(props.userId, props.eventId, abortController.signal);
      showToast(t.payApprovedSuccessfully, ToastType.SUCCESS);
      props.closeModal();
      props.refetchMembersAndReceiptInfo();
    } catch (error) {
      console.error(error);
      showToast(t.payApproveFailed, ToastType.ERROR);
    }
  }

  return (
    <div className={styles.paycheck}>
      <p className={styles.popupTitle}>{t.fastAproveText}</p>
      <div className={styles.paycheckContent}>
        <section className={styles.btnSection}>
          <Button className={styles.confirmPayBtn} kind={ButtonKind.WHITE_PRIMARY} size="short" onClick={() => aprovePayment()}>
            {t.confirmPayBtn}
          </Button>
        </section>
      </div>
    </div>
  );
}
