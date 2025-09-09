/* 'use client';
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
} */
'use client';
import styles from './styles.module.scss';
import { useModal } from '@contexts/ModalContext';

interface EditEventBtnProps {
  eventId: string;
}

export default function EditEventBtn(props: EditEventBtnProps) {
  const { open } = useModal();

  function goToEdit() {
    open(
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2>Edit Event</h2>
        <button onClick={() => alert(`Editing event ${props.eventId}`)}>
          Simple Modal Button
        </button>
      </div>,
      { title: 'Edit Event' }
    );
  }

  return (
    <button className={styles.editEventBtn} onClick={goToEdit}></button>
  );
}