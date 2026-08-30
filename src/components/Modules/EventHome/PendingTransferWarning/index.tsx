'use client';

import { useEffect, useState } from 'react';
import { useModal } from '@contexts/ModalContext';
import { getEventByIdAction } from 'app/[lang]/event/actions';
import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';

export default function PendingTransferWarning(props: { eventIds: string[] }) {
  const { open, close } = useModal();
  const { t } = useTranslation('eventHome');
  const [eventIndex, setEventIndex] = useState(0);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    getEventByIdAction(props.eventIds[eventIndex])
      .then(event => setEventName(event.title))
      .catch(error => console.error('Unable to load pending transfer event:', error));
  }, [props.eventIds, eventIndex]);

  useEffect(() => {
    if (!eventName) return;
    open(
      <div className={styles.popup}>
        <p>{t.pendingTransferWarning}</p>
        <strong>{eventName}</strong>
        <Button type="button" kind={ButtonKind.PRIMARY} size="short" onClick={() => { close(); window.location.href = `/event/${props.eventIds[eventIndex]}`; }}>
          {t.goToEvent}
        </Button>
        {props.eventIds.length > 1 && <Button type="button" kind={ButtonKind.SECONDARY} size="short" onClick={() => { setEventIndex(index => (index + 1) % props.eventIds.length); setEventName(''); }}>{eventIndex + 1}/{props.eventIds.length}</Button>}
      </div>,
      { title: t.pendingTransferWarning }
    );
  }, [eventName, props.eventIds, eventIndex, t, open, close]);

  return null;
}
