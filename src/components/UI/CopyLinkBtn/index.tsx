'use client';
import { showToast, ToastType } from '@utils/services/toastService';
import styles from './styles.module.scss';

export default function CopyLinkBtn() {
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('link copiado', ToastType.SUCCESS);
    });
  }
  return <button className={styles.copyLinkBtn} onClick={handleCopyLink}></button>;
}
