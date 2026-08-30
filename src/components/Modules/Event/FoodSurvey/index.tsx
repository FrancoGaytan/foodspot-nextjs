'use client';

import { useEffect, useState } from 'react';
import { createOptionAction, deleteOptionAction, editOptionAction, getMembersWhoHaventVotedAction } from 'app/[lang]/event/actions';
import { IOption } from '@models/options';
import Button, { ButtonKind } from '@components/UI/Button';
import { showToast, ToastType } from '@utils/services/toastService';
import styles from './styles.module.scss';

interface FoodSurveyProps { eventId: string; userId: string; options: IOption[]; canEdit: boolean; closeModal: () => void; }

export default function FoodSurvey(props: FoodSurveyProps) {
  const [options, setOptions] = useState(props.options ?? []);
  const [missing, setMissing] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [isPending, setIsPending] = useState(false);

  function refreshMissing() {
    getMembersWhoHaventVotedAction(props.eventId).then(result => setMissing(result.membersWhoHaventVoted.length)).catch(() => setMissing(0));
  }

  useEffect(() => {
    getMembersWhoHaventVotedAction(props.eventId)
      .then(result => setMissing(result.membersWhoHaventVoted.length))
      .catch(() => setMissing(0));
  }, [props.eventId]);

  async function addOption() {
    if (!newTitle.trim()) return;
    setIsPending(true);
    try {
      const option = await createOptionAction(props.eventId, newTitle.trim());
      setOptions(current => [...current, option]);
      setNewTitle('');
      refreshMissing();
    } catch (error) {
      console.error('Unable to add survey option:', error);
      showToast('No se pudo agregar la opción', ToastType.ERROR);
    } finally { setIsPending(false); }
  }

  async function removeOption(optionId: string) {
    try {
      await deleteOptionAction(optionId);
      setOptions(current => current.filter(option => option._id !== optionId));
      refreshMissing();
    } catch (error) {
      console.error('Unable to delete survey option:', error);
      showToast('No se pudo eliminar la opción', ToastType.ERROR);
    }
  }

  async function toggleVote(option: IOption) {
    const voted = option.participants.some(participant => participant._id === props.userId);
    const participants = voted
      ? option.participants.filter(participant => participant._id !== props.userId).map(participant => participant._id)
      : [...option.participants.map(participant => participant._id), props.userId];
    try {
      const updated = await editOptionAction(option._id, { participants });
      setOptions(current => current.map(item => item._id === updated._id ? updated : item));
      refreshMissing();
    } catch (error) {
      console.error('Unable to vote on survey option:', error);
      showToast('No se pudo registrar el voto', ToastType.ERROR);
    }
  }

  return <div className={styles.wrapper}>
    <div className={styles.options}>
      {options.map(option => {
        const voted = option.participants.some(participant => participant._id === props.userId);
        return <div className={styles.option} key={option._id}>
          <Button type="button" kind={voted ? ButtonKind.PRIMARY : ButtonKind.SECONDARY} size="small" onClick={() => toggleVote(option)}>{option.title}</Button>
          <span>{option.participants.length}</span>
          {props.canEdit && <button type="button" onClick={() => removeOption(option._id)} aria-label="Eliminar opción">x</button>}
        </div>;
      })}
    </div>
    <p>{missing === 0 ? 'Todos votaron' : `${missing} participante(s) sin votar`}</p>
    {props.canEdit && <div className={styles.add}><input value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="Nueva opción" /><Button type="button" kind={ButtonKind.PRIMARY} size="small" onClick={addOption} disabled={isPending}>Agregar</Button></div>}
    <Button type="button" kind={ButtonKind.TERTIARY} size="small" onClick={props.closeModal}>Cerrar</Button>
  </div>;
}
