'use client';
import styles from './styles.module.scss';
import { useModal } from '@contexts/ModalContext';
import { IEvent } from '@models/event';
import EditEventForm from '@components/Modules/Event/EditEventForm';
import { useRouter } from 'next/navigation';

interface EditEventBtnProps {
  event: IEvent;
}

export default function EditEventBtn(props: EditEventBtnProps) {
  const { open, close } = useModal();
  const router = useRouter();

  function goToEdit() {
    open(
      <EditEventForm event={props.event} closeModal={close} refetchEvent={() => router.refresh()} />,
      { title: 'Edit Event' }
    );
  }

  return (
    <button className={styles.editEventBtn} onClick={goToEdit}></button>
  );
}