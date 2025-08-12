'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getIconName, subscribeToToast } from '@utils/services/toastService';
import styles from './styles.module.scss';

export default function ToastContainer() {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    subscribeToToast(({ message, type }) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    });
  }, []);

  if (!toast) return null;

  return createPortal(
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <i className={`material-icons ${styles.toastIcon}`}>{getIconName(toast.type)}</i>
      <span>{toast.message}</span>
    </div>,
    document.body
  );
}
