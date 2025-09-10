'use client';
import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import { showToast, ToastType } from '@utils/services/toastService';
import { approveTransferReceipts, deleteTransferReceipt, getTransferReceipt } from '@services/transferReceiptsService';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { ITransferReceiptResponse } from '@models/transfer';
import { IEvent } from '@models/event';
import { getMembersAmount } from '@services/eventService';
import { gettingDateDiference } from '@utils/common/utilities';
import { getImage } from '@services/purchaseReceipts';
import FilesPreview from '@components/Shared/FilesPreview/FilesPreview';

interface ConfirmationPayProps {
  event: IEvent;
  transferReceiptId: string | undefined;
  userToApprove: string;
  closeModal: () => void;
  refetchEvent: () => void;
}

export interface FilePreview {
  uri: string;
  fileType?: string;
  fileName?: string;
}

export default function ConfirmationPayForm(props: ConfirmationPayProps) {
  const { t } = useTranslation('event');
  const [transferReceipt, setTransferReceipt] = useState<ITransferReceiptResponse>();
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [amountToValidate, setAmountToValidate] = useState<number>(0);

  async function confirmPayment(receiptId: string | undefined): Promise<void> {
    const abortController = new AbortController();
    try {
      await approveTransferReceipts(receiptId, props.event._id, abortController.signal);
      showToast(t.payApprovedSuccessfully, ToastType.SUCCESS);
      props.closeModal();
      props.refetchEvent();
    } catch (error) {
      console.error(error);
      showToast(t.payApproveFailed, ToastType.ERROR);
    }
  }

  async function rejectPayment(receiptId: string | undefined): Promise<void> {
    try {
      await deleteTransferReceipt(receiptId);
      showToast(t.payRejectedSuccessfully, ToastType.SUCCESS);
      props.closeModal();
      props.refetchEvent();
    } catch (error) {
      console.error(error);
      showToast(t.payRejectionFailed, ToastType.ERROR);
    }
  }

  function gettingPriceToPay(): number {
    let currentPenalization = 0;

    if (!props.event) {
      return 0;
    }

    if (props.event.penalization && gettingDateDiference(props.event.penalizationStartDate) > 0) {
      if (transferReceipt?.datetime && new Date(transferReceipt.datetime) < new Date()) {
        currentPenalization = props.event.penalization * Math.floor(gettingDateDiference(props.event.penalizationStartDate));
      }
    }
    return Math.round(amountToValidate + currentPenalization);
  }

  function closeFilePreview(): void {
    setFilePreview(null);
  }

  async function PreviewTransfer(transfer: ITransferReceiptResponse) {
    try {
      const transferImage = await getImage(transfer.image);
      const objectURL = URL.createObjectURL(transferImage);
      setFilePreview({
        uri: objectURL,
        fileType: transferImage.type.split('/')[1],
        fileName: 'File Preview',
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!props.transferReceiptId) {
      return;
    }
    getTransferReceipt(props.transferReceiptId)
      .then(res => {
        setTransferReceipt(res);
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.transferReceiptId]);

  useEffect(() => {
    if (!props.event?._id) return;
    getMembersAmount(props.event._id)
      .then(res => {
        const userToValidate = res.find(member => member.userId === props.userToApprove);
        setAmountToValidate(userToValidate?.amount || 0);
      })
      .catch(e => {
        console.error('Catch in context: ', e);
      });
  }, [props.event._id, props.userToApprove]);

  return (
    <div className={styles.paycheck}>
      <div className={styles.paycheckContent}>
        <div className={styles.priceSection}>
          {t.amountToBePaid}
          {gettingPriceToPay()}
        </div>
        <section className={styles.downloadContent}>
          {transferReceipt?.paymentMethod === 'cash' ? (
            <p className={styles.downloadText}>{t.paidByCashText}</p>
          ) : (
            <div className={styles.downloadTransferArea}>
              <button
                className={styles.previewBtn}
                onClick={e => {
                  e.preventDefault();
                  PreviewTransfer(transferReceipt as ITransferReceiptResponse);
                }}
                style={{ cursor: 'pointer' }}></button>
              <p className={styles.downloadText}>{t.previewText}</p>
            </div>
          )}
        </section>
        <section className={styles.btnSection}>
          <Button
            className={styles.confirmPayBtn}
            kind={ButtonKind.WHITE_PRIMARY}
            size="short"
            onClick={() => confirmPayment(props.transferReceiptId)}>
            {t.confirmPayBtn}
          </Button>
          <Button
            className={styles.rejectPayBtn}
            kind={ButtonKind.WHITE_SECONDARY}
            size="short"
            onClick={() => rejectPayment(props.transferReceiptId)}>
            {t.rejectPayBtn}
          </Button>
        </section>

        {filePreview && filePreview.fileType && filePreview.fileName && (
          <FilesPreview
            doc={[
              {
                uri: filePreview.uri,
                fileType: filePreview.fileType,
                fileName: filePreview.fileName,
              },
            ]}
            onClose={closeFilePreview}
          />
        )}
      </div>
    </div>
  );
}
