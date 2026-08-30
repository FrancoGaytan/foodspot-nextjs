'use client';

import { useEffect, useState } from 'react';
import { useModal } from '@contexts/ModalContext';
import { getEventByIdAction } from 'app/[lang]/event/actions';
import Button, { ButtonKind } from '@components/UI/Button';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';

export default function PendingTransferWarning(props: { eventId: string }) {
  const { open, close } = useModal();
  const { t } = useTranslation('eventHome');
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    getEventByIdAction(props.eventId)
      .then(event => setEventName(event.title))
      .catch(error => console.error('Unable to load pending transfer event:', error));
  }, [props.eventId]);

  useEffect(() => {
    if (!eventName) return;
    open(
      <div className={styles.popup}>
        <p>{t.pendingTransferWarning}</p>
        <strong>{eventName}</strong>
        <Button type="button" kind={ButtonKind.PRIMARY} size="short" onClick={() => { close(); window.location.href = `/event/${props.eventId}`; }}>
          {t.goToEvent}
        </Button>
      </div>,
      { title: t.pendingTransferWarning }
    );
  }, [eventName, props.eventId, t, open, close]);

  return null;
}
