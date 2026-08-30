'use client';

import { useEffect, useState } from 'react';
import { assignMembersToReceiptAction, getEventByIdAction, getPurchaseReceiptsAction } from 'app/[lang]/event/actions';
import { IParticipant, IPurchaseReceipt } from '@models/purchases';
import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import { showToast, ToastType } from '@utils/services/toastService';
import styles from './styles.module.scss';

interface AssignmentReceipt extends Omit<IPurchaseReceipt, 'participants'> {
  participants: IParticipant[];
}

interface AssignationTableProps {
  eventId: string;
  userId: string;
  closeModal: () => void;
}

export default function AssignationTable(props: AssignationTableProps) {
  const { t } = useTranslation('event');
  const [receipts, setReceipts] = useState<AssignmentReceipt[]>([]);
  const [members, setMembers] = useState<IParticipant[]>([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    Promise.all([getPurchaseReceiptsAction(props.eventId), getEventByIdAction(props.eventId)])
      .then(([purchaseReceipts, event]) => {
        setReceipts(purchaseReceipts as unknown as AssignmentReceipt[]);
        setMembers(event.members.map(member => ({ _id: member._id, name: member.name, lastName: member.lastName })));
      })
      .catch(error => console.error('Unable to load receipt assignments:', error));
  }, [props.eventId]);

  function canEdit(memberId: string, receipt: AssignmentReceipt): boolean {
    return receipt.shoppingDesignee._id === props.userId || memberId === props.userId;
  }

  function toggleMember(receiptId: string, member: IParticipant) {
    setReceipts(current => current.map(receipt => {
      if (receipt._id !== receiptId || !canEdit(member._id, receipt)) return receipt;
      const included = receipt.participants.some(participant => participant._id === member._id);
      return {
        ...receipt,
        participants: included
          ? receipt.participants.filter(participant => participant._id !== member._id)
          : [...receipt.participants, member],
      };
    }));
  }

  async function save() {
    setIsPending(true);
    try {
      await assignMembersToReceiptAction({
        receipts: receipts.map(receipt => ({ id: receipt._id, participants: receipt.participants.map(participant => participant._id) })),
      });
      showToast(t.assignationsUpdatedSuccessfully, ToastType.SUCCESS);
      props.closeModal();
    } catch (error) {
      console.error('Unable to save receipt assignments:', error);
      showToast(t.errorUpdatingAssignations, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><tr><th>{t.user}</th>{receipts.map(receipt => <th key={receipt._id}>{receipt.description}</th>)}</tr></thead>
          <tbody>{members.map(member => <tr key={member._id}>
            <td>{member.name} {member.lastName}</td>
            {receipts.map(receipt => <td key={receipt._id}>
              <input
                type="checkbox"
                checked={receipt.participants.some(participant => participant._id === member._id)}
                disabled={!canEdit(member._id, receipt)}
                onChange={() => toggleMember(receipt._id, member)}
              />
            </td>)}
          </tr>)}</tbody>
        </table>
      </div>
      <Button type="button" kind={ButtonKind.PRIMARY} size="medium" onClick={save} disabled={isPending}>
        {isPending ? '...' : t.confirmChangeBtn}
      </Button>
    </div>
  );
}