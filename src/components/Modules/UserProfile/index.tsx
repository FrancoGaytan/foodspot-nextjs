'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { IPublicUser } from '@models/user';
import { updateProfile, updateProfileImage, type ProfileActionState } from './actions';
import { useCustomRouter } from '@hooks/useCustomRouter';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';
import Spinner from '@components/UI/Spinner';
import ThemeSelector from './ThemeSelector';
import SegmentedControl from '@components/UI/SegmentedControl';

interface UserProfileProps {
  user: IPublicUser | null;
}

type ProfileData = Pick<IPublicUser, 'name' | 'lastName' | 'email' | 'alternativeEmail' | 'specialDiet' | 'cbu' | 'alias' | 'notifications'>;

const INITIAL_STATE: ProfileActionState = { success: false };
const DIETS = [
  ['vegan', 'veganDiet', 'veganDietDescription'],
  ['vegetarian', 'vegetarianDiet', 'vegetarianDietDescription'],
  ['celiac', 'celiacDiet', 'celiacDietDescription'],
  ['hypertensive', 'hypertensiveDiet', 'hypertensiveDietDescription'],
] as const;
const NOTIFICATIONS = [
  ['newEvent', 'newEventNotification'],
  ['eventStart', 'eventComingNotification'],
  ['penalizationStart', 'penalizationStartedNotification'],
  ['penalizationOneWeek', 'oneWeekDebtorNotification'],
] as const;

export default function UserProfile(props: UserProfileProps) {
  const [state, action, isPending] = useActionState(updateProfile, INITIAL_STATE);
  const pathname = usePathname();
  const router = useRouter();
  const { lang, switchLanguage } = useCustomRouter();
  const { t } = useTranslation('userProfile');
  const data: ProfileData = props.user ?? { name: '', lastName: '', email: '', specialDiet: [] };
  const [imageVersion, setImageVersion] = useState(0);
  const [imageAvailable, setImageAvailable] = useState(Boolean(props.user?.profilePicture));
  const [isImageUploading, setIsImageUploading] = useState(false);

  async function uploadProfileImage(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;
    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await updateProfileImage(formData);
      setImageAvailable(true);
      setImageVersion(Date.now());
      router.refresh();
    } catch {
      setImageAvailable(false);
    } finally {
      setIsImageUploading(false);
    }
  }

  return (
    <main className={styles.page}>
      <form action={action} className={styles.content}>
        <header className={styles.header}>
          <h1>{t.profileTitle}</h1>
          <p>{t.profileDescription}</p>
        </header>

        {!data.cbu && <p className={styles.notice}>{t.paymentNotice}</p>}
        {!props.user && <p className={`${styles.notice} ${styles.error}`}>{t.profileLoadError}</p>}

        <div className={styles.twoColumns}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{t.personalData}</h2>
            <div className={styles.cardBody}>
              <div className={styles.avatarRow}>
                <label className={styles.avatarPicker} aria-label={t.editImg}>
                  {imageAvailable ? (
                    <Image
                      className={styles.avatarImage}
                      key={imageVersion}
                      src="/api/profile-image"
                      alt={t.editImg}
                      width={88}
                      height={88}
                      unoptimized
                      onError={() => setImageAvailable(false)}
                    />
                  ) : <span className={styles.avatar} aria-hidden>{data.name.slice(0, 1)}{data.lastName.slice(0, 1)}</span>}
                  <input type="file" accept="image/png,image/jpeg" disabled={isImageUploading} onChange={event => uploadProfileImage(event.target.files?.[0])} />
                  <span className={styles.avatarEdit} aria-hidden><span className="material-icons">photo_camera</span></span>
                </label>
                <span>{isImageUploading ? <Spinner size={24} /> : t.editImg}</span>
              </div>
              <div className={styles.fields}>
              <label>{t.name}<input name="name" required autoComplete="given-name" defaultValue={data.name} /></label>
              <label>{t.lastName}<input name="lastName" required autoComplete="family-name" defaultValue={data.lastName} /></label>
              <label className={styles.full}>{t.personalEmail}<input type="email" autoComplete="email" value={data.email} readOnly /></label>
              <label className={styles.full}>{t.alternativeEmail}<input name="alternativeEmail" type="email" autoComplete="email" defaultValue={data.alternativeEmail ?? ''} placeholder="nombre@correo.com" /></label>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{t.financialData}</h2>
            <div className={styles.cardBody}>
              <div className={styles.fields}>
              <label className={styles.full}>{t.cbu}<input name="cbu" inputMode="numeric" defaultValue={data.cbu ?? ''} placeholder="000000310001..." /></label>
              <label className={styles.full}>{t.alias}<input name="alias" defaultValue={data.alias ?? ''} placeholder="tu.alias" /></label>
              </div>
            </div>
          </section>
        </div>

        <section className={`${styles.card} ${styles.dietCard}`}>
          <h2 className={styles.cardTitle}>{t.specialDietTitle}</h2>
          <div className={`${styles.cardBody} ${styles.optionsGrid}`}>
            {DIETS.map(([value, labelKey, descriptionKey]) => (
              <label className={styles.option} key={value}>
                <input name="specialDiet" type="checkbox" value={value} defaultChecked={data.specialDiet.includes(value)} />
                <span><strong>{t[labelKey]}</strong><small>{t[descriptionKey]}</small></span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t.notificationsTitle}</h2>
          <div className={`${styles.cardBody} ${styles.optionsGrid}`}>
            {NOTIFICATIONS.map(([value, labelKey]) => (
              <label className={styles.toggle} key={value}>
                <span>{t[labelKey]}</span>
                <input name={value} type="checkbox" defaultChecked={data.notifications?.[value] ?? false} />
              </label>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t.languageTitle}</h2>
          <div className={styles.cardBody}>
            <div className={styles.languageField}>
              <span>{t.languageLabel}</span>
              <SegmentedControl
                ariaLabel={t.languageLabel}
                value={lang}
                onChange={value => switchLanguage(value, pathname)}
                options={[
                  { value: 'es-AR', label: t.spanishLanguage, icon: <span className={styles.flag}>AR</span> },
                  { value: 'en-US', label: t.englishLanguage, icon: <span className={styles.flag}>US</span> },
                ]}
              />
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t.themeTitle}</h2>
          <div className={styles.cardBody}>
            <ThemeSelector />
          </div>
        </section>

        <footer className={styles.actions}>
          <div aria-live="polite">
            {state.success && <p className={styles.success}>{t.successMsg}</p>}
            {state.error && <p className={styles.failure}>{t.failureMsg}</p>}
          </div>
          <button type="submit" disabled={isPending} aria-label={isPending ? t.savingBtn : undefined}>{isPending ? <Spinner size={20} /> : t.saveChangesBtn}</button>
        </footer>
      </form>
    </main>
  );
}