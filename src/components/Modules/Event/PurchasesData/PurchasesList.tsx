'use client';

import { useState } from 'react';
import { deletePurchaseReceiptAction } from 'app/[lang]/event/actions';
import { IPurchaseReceipt } from '@models/purchases';
import Button, { ButtonKind } from '@components/UI/Button';
import Spinner from '@components/UI/Spinner';
import { showToast, ToastType } from '@utils/services/toastService';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';

interface PurchasesListProps {
  purchases: IPurchaseReceipt[];
  eventId: string;
  canDelete: boolean;
}

export default function PurchasesList(props: PurchasesListProps) {
  const { t } = useTranslation('eventHome');
  const [purchases, setPurchases] = useState(props.purchases);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function removePurchase(id: string) {
    setDeletingId(id);
    try {
      await deletePurchaseReceiptAction(id, props.eventId);
      setPurchases(current => current.filter(purchase => purchase._id !== id));
      showToast(t.purchaseDeleted, ToastType.SUCCESS);
    } catch (error) {
      console.error('Unable to delete purchase receipt:', error);
      showToast(t.purchaseDeletedError, ToastType.ERROR);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className={styles.purchasesList}>
      {purchases.map(purchase => (
        <div key={purchase._id} className={styles.purchasesRow}>
          <span>{purchase.description}</span>
          <span>{purchase.shoppingDesignee.name}</span>
          <span>{'$ ' + purchase.amount}</span>
          {props.canDelete && <Button
              kind={ButtonKind.TERTIARY}
              size="micro"
              className={styles.deleteBtn}
              onClick={() => removePurchase(purchase._id)}
              disabled={deletingId === purchase._id}
              aria-label={t.purchaseDeleted}>
              {deletingId === purchase._id ? <Spinner size={18} /> : 'x'}
            </Button>}
        </div>
      ))}
    </section>
  );
}
