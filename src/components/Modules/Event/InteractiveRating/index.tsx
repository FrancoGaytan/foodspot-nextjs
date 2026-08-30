'use client';

import { useEffect, useState } from 'react';
import { createRatingAction, getRatingFromUserAction } from 'app/[lang]/event/actions';
import { showToast, ToastType } from '@utils/services/toastService';
import styles from './styles.module.scss';

export default function InteractiveRating(props: { eventId: string; userId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    getRatingFromUserAction(props.eventId, props.userId)
      .then(response => setRating(response.score))
      .catch(() => undefined);
  }, [props.eventId, props.userId]);

  async function rate(score: number) {
    setIsPending(true);
    try {
      const response = await createRatingAction(props.eventId, props.userId, { score });
      setRating(response.score);
      showToast('Calificación guardada', ToastType.SUCCESS);
    } catch (error) {
      console.error('Unable to save event rating:', error);
      showToast('No se pudo guardar la calificación', ToastType.ERROR);
    } finally {
      setIsPending(false);
    }
  }

  return <div className={styles.rating} aria-label="Calificar evento" onMouseLeave={() => setHovered(0)}>
    {[1, 2, 3, 4, 5].map(score => <button key={score} type="button" disabled={isPending} className={(hovered || rating) >= score ? styles.active : ''} onMouseEnter={() => setHovered(score)} onClick={() => rate(score)} aria-label={`${score} estrellas`}>★</button>)}
  </div>;
}
