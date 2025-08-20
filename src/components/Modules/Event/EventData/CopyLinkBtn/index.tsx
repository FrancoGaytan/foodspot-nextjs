'use client';
import { showToast, ToastType } from '@utils/services/toastService';
import styles from './styles.module.scss';
import { useTranslation } from '@hooks/useTranslation';

export default function CopyLinkBtn() {
  const { t } = useTranslation('eventHome');
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast(t.linkCopiedToClipboard, ToastType.SUCCESS);
    });
  }
  return <button className={styles.copyLinkBtn} onClick={handleCopyLink}></button>;
}
