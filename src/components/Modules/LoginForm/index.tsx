'use client';

import { useActionState, useEffect } from 'react';
import { handleLogin } from 'app/[lang]/(auth)/login/actions';
import FormLayout from '@components/Shared/layout/FormLayout';
import Button, { ButtonKind } from '@components/UI/Button';
import { EmailInput } from '@components/UI/Inputs/EmailInput';
import { PasswordInput } from '@components/UI/Inputs/PasswordInput';
import LinkCustom from '@components/UI/LinkCustom';
import styles from './styles.module.scss';
import { showToast, ToastType } from '@utils/services/toastService';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { useTranslation } from '@hooks/useTranslation';
import ToastQueryTrigger from '@components/UI/ToastQueryTrigger';

export type LoginFormState = { success: true; error?: undefined } | { success?: false; error: '' | 'invalidCredentials' | 'loginFailed' };

export default function LoginForm() {
  const { pushTo } = useCustomRouter();
  const { t, lang } = useTranslation('login');
  const [formState, formAction] = useActionState<LoginFormState, FormData>(handleLogin, {
    error: '',
  });

  useEffect(() => {
    if (!formState) return;
    if (formState.success) {
      showToast(t.welcomeMessage, ToastType.SUCCESS);
      pushTo('eventHome?success=1');
    }

    if (formState.error === 'invalidCredentials') {
      showToast(t.loginErrorMessage, ToastType.ERROR);
    }

    if (formState.error === 'loginFailed') {
      showToast(t.loginErrorUnexpected, ToastType.ERROR);
    }
  }, [formState, t, pushTo]);

  return (
    <FormLayout>
      <ToastQueryTrigger queryKey="success" matchValue="1" message={t.userRegistered} type={ToastType.SUCCESS} />
      <ToastQueryTrigger queryKey="success" matchValue="2" message={t.passwordChangedSuccessfully} type={ToastType.SUCCESS} />
      <form action={formAction}>
        <input type="hidden" name="lang" value={lang} />
        <h3 className={styles.title}>{t.loginTitle}</h3>

        <EmailInput name="email" label={t.email} placeholder={t.email} />
        <PasswordInput name="password" label={t.password} placeholder={t.password} />

        <Button kind={ButtonKind.PRIMARY} size="large" type="submit" className={styles.submitButton}>
          {t.loginBtn}
        </Button>

        <div className={styles.linksContainer}>
          <LinkCustom href="/recoverKey" className={styles.forgotPassword}>
            {t.forgotPassword}
          </LinkCustom>
        </div>

        <div className={styles.linksContainer}>
          <LinkCustom href="/register" className={styles.register} id="register">
            <span>{t.alreadyRegistered} </span>
            <span className={styles.registerHighlighted}>{t.registerHere}</span>
          </LinkCustom>
        </div>
      </form>
    </FormLayout>
  );
}
