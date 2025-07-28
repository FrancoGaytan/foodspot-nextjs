'use client';

import { useActionState, useEffect } from 'react';
import { handleRecoverKey } from 'app/[lang]/(auth)/recoverKey/actions';
import { EmailInput } from '@components/micro/Inputs/EmailInput';
import Button, { ButtonKind } from '@components/micro/Button';
import styles from './styles.module.scss';
import FormLayout from '@components/macro/layout/FormLayout';
import { showToast, ToastType } from '@utils/toastService';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { useTranslation } from '@hooks/useTranslation';
import ToastQueryTrigger from '@components/micro/ToastQueryTrigger';

export type RecoverKeyFormState =
  | { success: true; error?: undefined }
  | { success?: false; error: '' | 'wrongDataEntered' | 'noMatchingMail' | 'recoverKeyFailure' };

export default function RecoverKeyForm() {
  const { t } = useTranslation('recoverKey');
  const [formState, formAction] = useActionState<RecoverKeyFormState, FormData>(handleRecoverKey, { error: '' });
  const { pushTo } = useCustomRouter();

  useEffect(() => {
    if (formState.success) {
      showToast(t.emailSentConfirmation, ToastType.SUCCESS);
      pushTo('settingNewPassword?success=1');
    }

    if (formState.error === 'wrongDataEntered') {
      showToast(t.wrongDataEntered, ToastType.ERROR);
    }

    if (formState.error === 'noMatchingMail') {
      showToast(t.noMatchingEmail, ToastType.ERROR);
    }

    if (formState.error === 'recoverKeyFailure') {
      showToast(t.recoverError, ToastType.ERROR);
    }
  }, [formState]);

  return (
    <FormLayout>
      <ToastQueryTrigger queryKey="success" matchValue="1" message={t.loginSuccessMessage ?? 'Sesión iniciada con éxito'} type={ToastType.SUCCESS} />{' '}
      {/* Esto despues pasalo al home, no corresponde que este aca */}
      <form action={formAction}>
        <div className={styles.recoverKeyContainer}>
          <h1>{t.newPassword}</h1>

          <p className={styles.mainDesc}>{t.changeDescription}</p>

          <EmailInput name="email" label={t.email} placeholder={t.email} className={styles.input} />
          <Button kind={ButtonKind.PRIMARY} size="large" type="submit" className={styles.sendBtn}>
            {t.sendEmail}
          </Button>
        </div>
      </form>
    </FormLayout>
  );
}
