'use client';

import { useActionState, useEffect } from 'react';
import { handleSetNewPassword } from 'app/[lang]/(auth)/settingNewPassword/actions';
import FormLayout from '@components/Shared/layout/FormLayout';
import { EmailInput } from '@components/UI/Inputs/EmailInput';
import { PasswordInput } from '@components/UI/Inputs/PasswordInput';
import TextInput from '@components/UI/Inputs/TextInput';
import Button, { ButtonKind } from '@components/UI/Button';
import styles from './styles.module.scss';
import { showToast, ToastType } from '@utils/services/toastService';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { useTranslation } from '@hooks/useTranslation';
import ToastQueryTrigger from '@components/UI/ToastQueryTrigger';

export type SettingNewPasswordFormState =
  | { success: true; error?: undefined }
  | {
      success?: false;
      error: '' | 'invalidVerificationCode' | 'missingFields' | 'invalidPassword' | 'passwordMismatch' | 'updateFailed';
    };

export default function SettingNewPasswordForm() {
  const { t } = useTranslation('settingNewPassword');
  const [formState, formAction] = useActionState<SettingNewPasswordFormState, FormData>(handleSetNewPassword, { error: '' });
  const { pushTo } = useCustomRouter();

  useEffect(() => {
    if (formState.success) {
      showToast(t.successMsg, ToastType.SUCCESS);
      pushTo('login');
    }

    if (formState.error === 'invalidVerificationCode') {
      showToast(t.invalidVerificationCode, ToastType.ERROR);
    }

    if (formState.error === 'missingFields') {
      showToast(t.missingFields, ToastType.ERROR);
    }

    if (formState.error === 'invalidPassword') {
      showToast(t.wrongPassword, ToastType.WARNING);
    }

    if (formState.error === 'passwordMismatch') {
      showToast(t.passwordsDontMatch, ToastType.WARNING);
    }

    if (formState.error === 'updateFailed') {
      showToast(t.couldntUpdatePassword, ToastType.ERROR);
    }
  }, [
    formState,
    pushTo,
    t.couldntUpdatePassword,
    t.invalidVerificationCode,
    t.missingFields,
    t.passwordsDontMatch,
    t.successMsg,
    t.wrongPassword,
  ]);

  return (
    <FormLayout>
      <ToastQueryTrigger queryKey="success" matchValue="1" message={t.emailSentConfirmation} type={ToastType.SUCCESS} />{' '}
      <form action={formAction}>
        <div className={styles.settingNewPasswordContainer}>
          <h1>{t.setNewPasswordTitle}</h1>

          <EmailInput name="email" label={t.email} placeholder={t.email} className={styles.input} />

          <TextInput name="verificationCode" label={t.verificationCode} placeholder={t.verificationCode} className={styles.input} />

          <PasswordInput name="password" label={t.password} placeholder={t.password} className={styles.input} />

          <p className={styles.mainDesc}>{t.passwordDescription}</p>

          <PasswordInput name="confirmPassword" label={t.confirmPassword} placeholder={t.confirmPassword} className={styles.input} />

          <Button type="submit" kind={ButtonKind.PRIMARY} size="large" id="registerBtn" style={{ marginBottom: 30, marginTop: 30 }}>
            {t.setKeyBtn}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
