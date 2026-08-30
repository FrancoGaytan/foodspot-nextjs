'use client';

import { FormEvent, useState } from 'react';
import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import { showToast, ToastType } from '@utils/services/toastService';
import { createTransferReceiptAction, uploadTransferReceiptFileAction } from 'app/[lang]/event/actions';
import { IEvent } from '@models/event';
import { PayCheckInfoResponse } from '@models/transfer';
import styles from './styles.module.scss';

interface PaymentFormProps {
  event: IEvent;
  userId: string;
  paymentInfo: PayCheckInfoResponse;
  closeModal: () => void;
  refetchEvent: () => void;
}

export default function PaymentForm(props: PaymentFormProps) {
  const { t } = useTranslation('event');
  const [method, setMethod] = useState<'transfer' | 'cash'>('transfer');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const amount = Math.round(props.paymentInfo.amount);

  async function copyValue(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    showToast(t.linkCopiedToClipboard, ToastType.SUCCESS);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (method === 'transfer' && !file) {
      showToast(t.uploadReceiptFirst, ToastType.ERROR);
      return;
    }

    setIsPending(true);
    try {
      const receipt = await createTransferReceiptAction(props.event._id, {
        amount,
        description,
        paymentMethod: method,
        user: props.userId,
        receiver: props.paymentInfo.receiver.receiverId,
      });
      if (method === 'transfer' && file) {
        await uploadTransferReceiptFileAction(receipt._id, file);
      }
      showToast(t.transferReceiptLoaded, ToastType.SUCCESS);
      props.closeModal();
      props.refetchEvent();
    } catch (error) {
      console.error('Unable to submit payment:', error);
      showToast(t.transferReceiptFailure, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.paycheck}>
      <h4>{t.payTitle}</h4>
      <p className={styles.amount}>${amount}</p>
      <div className={styles.paycheckContent}>
      <p className={styles.paymentData}>{t.shoppingDesignee}{props.paymentInfo.receiver.receiverName}</p>
      <p className={styles.paymentData}>{t.alias}{props.paymentInfo.receiver.receiverAlias || t.empty}{props.paymentInfo.receiver.receiverAlias && <button type="button" className={styles.copyBtn} onClick={() => copyValue(props.paymentInfo.receiver.receiverAlias)} aria-label={t.alias} />}</p>
      <p className={styles.paymentData}>{t.cbu}{props.paymentInfo.receiver.receiverCbu || t.empty}{props.paymentInfo.receiver.receiverCbu && <button type="button" className={styles.copyBtn} onClick={() => copyValue(props.paymentInfo.receiver.receiverCbu)} aria-label={t.cbu} />}</p>
      <form className={styles.form} onSubmit={submit}>
      <fieldset>
        <legend>{t.payOptTitle}</legend>
        <label><input type="radio" checked={method === 'transfer'} onChange={() => setMethod('transfer')} /> {t.transferRadioBtn}</label>
        <label><input type="radio" checked={method === 'cash'} onChange={() => setMethod('cash')} /> {t.cashRadioBtn}</label>
      </fieldset>
      <label>{t.description}<input value={description} onChange={event => setDescription(event.target.value)} /></label>
      {method === 'transfer' && <label className={styles.fileInput}>{t.uploadTransferReceipt}<input type="file" accept="image/jpeg,image/png,application/pdf" onChange={event => setFile(event.target.files?.[0] ?? null)} required /><span className={styles.uploadRow}><span className={styles.uploadBtn} />{file?.name || t.uploadTransferReceipt}</span></label>}
      <Button type="submit" kind={ButtonKind.PRIMARY} size="medium" disabled={isPending}>{isPending ? '...' : t.confirmPayBtn}</Button>
      </form>
      </div>
    </div>
  );
}
