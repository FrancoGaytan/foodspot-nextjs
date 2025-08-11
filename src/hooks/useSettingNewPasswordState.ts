'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { recoverPassword, verifyCode } from '@services/password';
import { showToast, ToastType } from '@utils/services/toastService';

interface InitialNewPasswordInterface {
  userEmail: string;
  userVerificationCode: string;
  userPassword: string;
  userConfirmedPassword: string;
}

export function useSettingNewPasswordState(lang) {
  const router = useRouter();

  const [credentials, setCredentials] = useState<InitialNewPasswordInterface>({
    userEmail: '',
    userVerificationCode: '',
    userPassword: '',
    userConfirmedPassword: '',
  });

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const updateField = (key: keyof InitialNewPasswordInterface, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const validatePassword = (password: string): boolean => {
    const expReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return expReg.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (credentials.userPassword !== credentials.userConfirmedPassword) {
      showToast(lang.passwordsDontMatch, ToastType.ERROR);
      return;
    }

    if (!validatePassword(credentials.userPassword)) {
      showToast(lang.wrongPassword, ToastType.ERROR);
      return;
    }

    try {
      await verifyCode({
        email: credentials.userEmail,
        verificationCode: credentials.userVerificationCode,
      });

      await recoverPassword({
        email: credentials.userEmail,
        verificationCode: credentials.userVerificationCode,
        password: credentials.userPassword,
      });

      showToast(lang.passwordChangedSuccessfully, ToastType.INFO);
      setTimeout(() => router.push('/login'), 1000);
    } catch (e) {
      console.error(e);
      showToast(lang.couldntUpdatePassword, ToastType.ERROR);
    }
  };

  return {
    credentials,
    updateField,
    handleSubmit,
    passwordRef,
    confirmPasswordRef,
  };
}
