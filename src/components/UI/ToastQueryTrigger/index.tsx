'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { showToast, ToastType } from '@utils/services/toastService';

interface ToastQueryTriggerProps {
  queryKey: string;
  matchValue: string;
  message: string;
  type?: ToastType;
}

export default function ToastQueryTrigger(props: ToastQueryTriggerProps) {
  const searchParams = useSearchParams();
  const value = searchParams.get(props.queryKey);

  useEffect(() => {
    if (value === props.matchValue) {
      showToast(props.message, props.type);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.message, props.type]);

  return null;
}
