'use client';

import { FormEvent, useState } from 'react';
import Button, { ButtonKind } from '@components/UI/Button';
import Spinner from '@components/UI/Spinner';
import { useTranslation } from '@hooks/useTranslation';
import { editEventAction } from 'app/[lang]/event/actions';
import { IEvent } from '@models/event';
import { showToast, ToastType } from '@utils/services/toastService';
import styles from './styles.module.scss';

interface EditEventFormProps { event: IEvent; closeModal: () => void; refetchEvent: () => void; }

function toInputDate(value: Date | string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function EditEventForm(props: EditEventFormProps) {
  const { t } = useTranslation('createEvent');
  const [title, setTitle] = useState(props.event.title);
  const [datetime, setDatetime] = useState(toInputDate(props.event.datetime));
  const [description, setDescription] = useState(props.event.description);
  const [memberLimit, setMemberLimit] = useState(String(props.event.memberLimit));
  const [isPrivate, setIsPrivate] = useState(Boolean(props.event.isPrivate));
  const [penalization, setPenalization] = useState(String(props.event.penalization || ''));
  const [penalizationStartDate, setPenalizationStartDate] = useState(
    props.event.penalizationStartDate ? toInputDate(props.event.penalizationStartDate) : ''
  );
  const [isPending, setIsPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const limit = Number(memberLimit);
    const penalty = Number(penalization || 0);
    if (!title.trim() || !description.trim() || !datetime || !Number.isFinite(limit) || limit < props.event.members.length || penalty < 0) {
      showToast(t.completeAllInputs, ToastType.ERROR);
      return;
    }
    if (penalty > 0 && (!penalizationStartDate || new Date(penalizationStartDate) <= new Date(datetime))) {
      showToast(t.wrongPenalizationDate, ToastType.ERROR);
      return;
    }

    setIsPending(true);
    try {
      await editEventAction(props.event._id, {
        ...props.event,
        title: title.trim(),
        datetime: new Date(datetime),
        description: description.trim(),
        memberLimit: limit,
        isPrivate,
        penalization: penalty,
        penalizationStartDate: penalty > 0 ? new Date(penalizationStartDate) : props.event.penalizationStartDate,
      });
      showToast(t.eventUpdateConfirmation, ToastType.SUCCESS);
      props.closeModal();
      props.refetchEvent();
    } catch (error) {
      console.error('Unable to edit event:', error);
      showToast(t.eventRegistrationFailure, ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  return <form className={styles.form} onSubmit={submit}>
    <label>{t.eventName}<input value={title} onChange={event => setTitle(event.target.value)} required /></label>
    <label>{t.dateTime}<input type="datetime-local" value={datetime} onChange={event => setDatetime(event.target.value)} required /></label>
    <label>{t.eventDescription}<textarea value={description} onChange={event => setDescription(event.target.value)} required /></label>
    <label>{t.memberLimit}<input type="number" min={props.event.members.length} value={memberLimit} onChange={event => setMemberLimit(event.target.value)} required /></label>
    <label><span>{t.isPrivate}</span><input type="checkbox" checked={isPrivate} onChange={event => setIsPrivate(event.target.checked)} /></label>
    <label>{t.amountPenalization}<input type="number" min="0" value={penalization} onChange={event => setPenalization(event.target.value)} /></label>
    {penalization && <label>{t.penalizationStartingDate}<input type="datetime-local" value={penalizationStartDate} onChange={event => setPenalizationStartDate(event.target.value)} /></label>}
    <Button type="submit" kind={ButtonKind.PRIMARY} size="medium" disabled={isPending} aria-label={isPending ? t.editEventBtn : undefined}>{isPending ? <Spinner size={20} /> : t.editEventBtn}</Button>
  </form>;
}
