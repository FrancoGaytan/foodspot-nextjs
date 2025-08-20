'use client';
import { useCustomRouter } from '@hooks/useCustomRouter';
import styles from './styles.module.scss';

interface EditEventBtnProps {
  eventId: string;
}

export default function EditEventBtn(props: EditEventBtnProps) {
  const { pushTo } = useCustomRouter();

  function goToEdit() {
    pushTo(`/createEvent/${props.eventId}`);
  }

  return <button className={styles.editEventBtn} onClick={goToEdit}></button>;
}
