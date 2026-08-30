'use client';

import { useActionState } from 'react';
import type { IPublicUser } from '@models/user';
import { updateProfile, type ProfileActionState } from './actions';
import styles from './styles.module.scss';

interface UserProfileProps {
  user: IPublicUser | null;
}

type ProfileData = Pick<IPublicUser, 'name' | 'lastName' | 'email' | 'alternativeEmail' | 'specialDiet' | 'cbu' | 'alias' | 'notifications'>;

const INITIAL_STATE: ProfileActionState = { success: false };
const DIETS = [
  ['vegan', 'Vegana', 'Sin productos de origen animal'],
  ['vegetarian', 'Vegetariana', 'Sin carne ni pescado'],
  ['celiac', 'Celíaca', 'Sin gluten'],
  ['hypertensive', 'Hipertensa', 'Baja en sodio'],
] as const;
const NOTIFICATIONS = [
  ['newEvent', 'Nuevo evento'],
  ['eventStart', 'Inicio de evento'],
  ['penalizationStart', 'Inicio de penalización'],
  ['penalizationOneWeek', 'Recordatorio de penalización'],
] as const;

export default function UserProfile(props: UserProfileProps) {
  const [state, action, isPending] = useActionState(updateProfile, INITIAL_STATE);
  const data: ProfileData = props.user ?? { name: '', lastName: '', email: '', specialDiet: [] };

  return (
    <main className={styles.page}>
      <form action={action} className={styles.content}>
        <header className={styles.header}>
          <h1>Mi perfil</h1>
          <p>Datos personales, pagos y preferencias.</p>
        </header>

        {!data.cbu && <p className={styles.notice}>Completá tu CBU o alias para poder recibir pagos en tus eventos.</p>}
        {!props.user && <p className={`${styles.notice} ${styles.error}`}>No pudimos cargar tus datos. Podés volver a intentar guardar el perfil.</p>}

        <div className={styles.twoColumns}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Información personal</h2>
            <div className={styles.cardBody}>
              <div className={styles.avatarRow}>
                <span className={styles.avatar} aria-hidden>{data.name.slice(0, 1)}{data.lastName.slice(0, 1)}</span>
                <span>Datos de tu cuenta</span>
              </div>
              <div className={styles.fields}>
              <label>Nombre<input name="name" required defaultValue={data.name} /></label>
              <label>Apellido<input name="lastName" required defaultValue={data.lastName} /></label>
              <label className={styles.full}>Correo electrónico<input type="email" value={data.email} readOnly /></label>
              <label className={styles.full}>Correo alternativo<input name="alternativeEmail" type="email" defaultValue={data.alternativeEmail ?? ''} placeholder="nombre@correo.com" /></label>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Información financiera</h2>
            <div className={styles.cardBody}>
              <div className={styles.fields}>
              <label className={styles.full}>CBU<input name="cbu" inputMode="numeric" defaultValue={data.cbu ?? ''} placeholder="000000310001..." /></label>
              <label className={styles.full}>Alias<input name="alias" defaultValue={data.alias ?? ''} placeholder="tu.alias" /></label>
              </div>
            </div>
          </section>
        </div>

        <section className={`${styles.card} ${styles.dietCard}`}>
          <h2 className={styles.cardTitle}>Preferencias dietéticas</h2>
          <div className={`${styles.cardBody} ${styles.optionsGrid}`}>
            {DIETS.map(([value, label, description]) => (
              <label className={styles.option} key={value}>
                <input name="specialDiet" type="checkbox" value={value} defaultChecked={data.specialDiet.includes(value)} />
                <span><strong>{label}</strong><small>{description}</small></span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Notificaciones</h2>
          <div className={`${styles.cardBody} ${styles.optionsGrid}`}>
            {NOTIFICATIONS.map(([value, label]) => (
              <label className={styles.toggle} key={value}>
                <span>{label}</span>
                <input name={value} type="checkbox" defaultChecked={data.notifications?.[value] ?? false} />
              </label>
            ))}
          </div>
        </section>

        <footer className={styles.actions}>
          {state.success && <p className={styles.success}>La información se modificó con éxito.</p>}
          {state.error && <p className={styles.failure}>No se pudo actualizar la información. Volvé a intentarlo.</p>}
          <button type="submit" disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar cambios'}</button>
        </footer>
      </form>
    </main>
  );
}