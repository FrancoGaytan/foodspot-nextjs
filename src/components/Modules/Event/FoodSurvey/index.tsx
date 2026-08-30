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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [viewing, setViewing] = useState<IOption | null>(null);

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

  async function toggleAllVotes() {
    const allVoted = options.length > 0 && options.every(option => option.participants.some(participant => participant._id === props.userId));
    setIsPending(true);
    try {
      const updated = await Promise.all(options.map(option => {
        const hasVote = option.participants.some(participant => participant._id === props.userId);
        const participants = allVoted
          ? option.participants.filter(participant => participant._id !== props.userId).map(participant => participant._id)
          : hasVote
            ? option.participants.map(participant => participant._id)
            : [...option.participants.map(participant => participant._id), props.userId];
        return editOptionAction(option._id, { participants });
      }));
      setOptions(updated);
      refreshMissing();
    } catch (error) {
      console.error('Unable to update all survey votes:', error);
      showToast('No se pudieron actualizar los votos', ToastType.ERROR);
    } finally { setIsPending(false); }
  }

  async function saveTitle(option: IOption) {
    const title = editingTitle.trim();
    if (!title || title === option.title) { setEditingId(null); return; }
    try {
      const updated = await editOptionAction(option._id, { title });
      setOptions(current => current.map(item => item._id === updated._id ? updated : item));
      setEditingId(null);
    } catch (error) {
      console.error('Unable to edit survey option:', error);
      showToast('No se pudo editar la opción', ToastType.ERROR);
    }
  }

  return <div className={styles.wrapper}>
    <div className={styles.options}>
      <div className={styles.heading}><span>Opción</span><span>Votos</span><span>Mi voto</span><button type="button" onClick={toggleAllVotes} disabled={isPending}>{options.length > 0 && options.every(option => option.participants.some(participant => participant._id === props.userId)) ? 'Quitar todos' : 'Seleccionar todos'}</button></div>
      {options.map(option => {
        const voted = option.participants.some(participant => participant._id === props.userId);
        const totalVotes = options.reduce((total, item) => total + item.participants.length, 0);
        const percentage = totalVotes ? Math.round(option.participants.length / totalVotes * 100) : 0;
        return <div className={styles.option} key={option._id}>
          <div className={styles.titleCell}>
            {editingId === option._id ? <input autoFocus value={editingTitle} onChange={event => setEditingTitle(event.target.value)} onBlur={() => saveTitle(option)} onKeyDown={event => { if (event.key === 'Enter') saveTitle(option); if (event.key === 'Escape') setEditingId(null); }} /> : <button type="button" className={styles.titleButton} onClick={() => props.canEdit && (setEditingId(option._id), setEditingTitle(option.title))}>{option.title}</button>}
            <div className={styles.progress}><span style={{ width: `${percentage}%` }} /></div>
          </div>
          <span className={styles.votes}>{option.participants.length}</span>
          <label className={styles.checkbox}><input type="checkbox" checked={voted} onChange={() => toggleVote(option)} /><span /></label>
          <div className={styles.actions}><button type="button" onClick={() => setViewing(option)} aria-label="Ver participantes">◉</button>{props.canEdit && <button type="button" onClick={() => removeOption(option._id)} aria-label="Eliminar opción">x</button>}</div>
        </div>;
      })}
    </div>
    {viewing && <div className={styles.detail}><strong>{viewing.title}</strong>{viewing.participants.length ? viewing.participants.map(participant => <span key={participant._id}>{participant.name} {participant.lastName}</span>) : <span>Sin votos todavía</span>}<Button type="button" kind={ButtonKind.TERTIARY} size="small" onClick={() => setViewing(null)}>Cerrar detalle</Button></div>}
    <p>{missing === 0 ? 'Todos votaron' : `${missing} participante(s) sin votar`}</p>
    {props.canEdit && <div className={styles.add}><input value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="Nueva opción" /><Button type="button" kind={ButtonKind.PRIMARY} size="small" onClick={addOption} disabled={isPending}>Agregar</Button></div>}
    <Button type="button" kind={ButtonKind.TERTIARY} size="small" onClick={props.closeModal}>Cerrar</Button>
  </div>;
}
