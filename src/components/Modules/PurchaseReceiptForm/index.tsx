'use client';

import { FormEvent, useState } from 'react';
import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import { showToast, ToastType } from '@utils/services/toastService';
import { createPurchaseReceiptAction, uploadPurchaseReceiptFileAction } from 'app/[lang]/event/actions';
import { IEvent } from '@models/event';
import styles from './styles.module.scss';

interface PurchaseReceiptFormProps {
  event: IEvent;
  closeModal: () => void;
  refetchEvent: () => void;
}

export default function PurchaseReceiptForm(props: PurchaseReceiptFormProps) {
  const { t } = useTranslation('event');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !description.trim() || Number(amount) <= 0) {
      showToast(t.uploadReceiptFirst, ToastType.ERROR);
      return;
    }

    setIsPending(true);
    try {
      const receipt = await createPurchaseReceiptAction(props.event._id, { amount: Number(amount), description: description.trim() });
      await uploadPurchaseReceiptFileAction(receipt._id, file);
      showToast(t.purchaseReceiptLoaded, ToastType.SUCCESS);
      props.closeModal();
      props.refetchEvent();
    } catch (error) {
      console.error('Unable to submit purchase receipt:', error);
      showToast(t.loadingPurchaseError, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>{t.description}<input value={description} onChange={event => setDescription(event.target.value)} required /></label>
      <label>{t.amountLabel}<input type="number" min="0.01" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} required /></label>
      <label>{t.uploadPurchaseReceipt}<input type="file" accept="image/jpeg,image/png,application/pdf" onChange={event => setFile(event.target.files?.[0] ?? null)} required /></label>
      <Button type="submit" kind={ButtonKind.PRIMARY} size="medium" disabled={isPending}>{isPending ? '...' : t.confirmPayBtn}</Button>
    </form>
  );
}
