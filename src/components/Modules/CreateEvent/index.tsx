'use client';

import { useActionState, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createEvent, type CreateEventActionState } from './actions';
import Spinner from '@components/UI/Spinner';
import styles from './styles.module.scss';

const STEPS = ['Datos', 'Configuración', 'Invitados', 'Roles'];
const INITIAL_STATE: CreateEventActionState = { success: false };

export default function CreateEvent() {
  const router = useRouter();
  const params = useParams<{ lang: string }>();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [memberLimit, setMemberLimit] = useState(12);
  const [isPrivate, setIsPrivate] = useState(false);
  const [penalization, setPenalization] = useState('');
  const [penalizationStartDate, setPenalizationStartDate] = useState('');
  const [isChef, setIsChef] = useState(false);
  const [isShoppingDesignee, setIsShoppingDesignee] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [state, action, isPending] = useActionState(createEvent, INITIAL_STATE);

  useEffect(() => {
    if (state.success) router.push(`/${params.lang}/eventHome?success=1`);
  }, [params.lang, router, state.success]);

  const payload = JSON.stringify({
    title,
    datetime,
    description,
    memberLimit: Number(memberLimit),
    isPrivate,
    penalization: penalization ? Number(penalization) : null,
    penalizationStartDate: penalizationStartDate || null,
    isChef,
    isShoppingDesignee,
  });

  function nextStep() {
    if (step === 0 && (!title.trim() || !datetime || !description.trim())) {
      setValidationError('Completá título, fecha y descripción para continuar.');
      return;
    }
    if (step === 1 && (!Number.isFinite(Number(memberLimit)) || Number(memberLimit) < 1)) {
      setValidationError('Indicá un límite de al menos un comensal.');
      return;
    }
    setValidationError('');
    setStep(current => Math.min(current + 1, STEPS.length - 1));
  }

  return (
    <main className={styles.page}>
      <form action={action} className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Nuevo encuentro</p>
          <h1>Crear evento</h1>
          <p>Completá los pasos para publicar tu próximo asado.</p>
        </header>

        <ol
          className={styles.stepper}
          aria-label="Pasos para crear evento"
          style={{ '--progress': `${(step / (STEPS.length - 1)) * 100}%` } as React.CSSProperties}>
          {STEPS.map((label, index) => {
            const className = [
              index <= step ? styles.activeStep : '',
              index < step ? styles.completedStep : '',
            ].filter(Boolean).join(' ');

            return <li className={className} key={label}><span>{index + 1}</span><small>{label}</small></li>;
          })}
        </ol>

        <section className={styles.surface}>
          {step === 0 && <div className={styles.fields}>
            <label>Título del evento<input value={title} onChange={event => setTitle(event.target.value)} placeholder="Asado en el patio" required /></label>
            <label>Fecha y hora<input type="datetime-local" value={datetime} onChange={event => setDatetime(event.target.value)} required /></label>
            <label>Descripción<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Detalles del evento, comida y qué hay que llevar..." required /></label>
          </div>}

          {step === 1 && <div className={styles.fields}>
            <label className={styles.setting}><span><strong>Evento privado</strong><small>Solo quienes reciban el enlace podrán verlo y anotarse.</small></span><input type="checkbox" checked={isPrivate} onChange={event => setIsPrivate(event.target.checked)} /></label>
            <label>Límite de comensales<input type="number" min="1" value={memberLimit} onChange={event => setMemberLimit(Number(event.target.value))} /></label>
            <label>Penalización por mora (opcional)<input type="number" min="0" value={penalization} onChange={event => setPenalization(event.target.value)} placeholder="500" /></label>
            {penalization && <label>Inicio de penalización<input type="datetime-local" value={penalizationStartDate} onChange={event => setPenalizationStartDate(event.target.value)} /></label>}
          </div>}

          {step === 2 && <div className={styles.invites}>
            <h2>Invitados</h2>
            <p>El evento se crea con tu inscripción confirmada. Una vez publicado, compartí su enlace para que otras personas puedan anotarse.</p>
            <p className={styles.inviteNote}>Las invitaciones directas no están disponibles todavía en FoodSpot.</p>
          </div>}

          {step === 3 && <div className={styles.roles}>
            <h2>Roles del evento</h2>
            <label className={styles.role}><input type="checkbox" checked disabled /><span><strong>Organizador (vos)</strong><small>Coordinás el evento y las decisiones generales.</small></span></label>
            <label className={styles.role}><input type="checkbox" checked={isChef} onChange={event => setIsChef(event.target.checked)} /><span><strong>Asador</strong><small>Te encargás de la parrilla y los tiempos de cocción.</small></span></label>
            <label className={styles.role}><input type="checkbox" checked={isShoppingDesignee} onChange={event => setIsShoppingDesignee(event.target.checked)} /><span><strong>Encargado de compras</strong><small>Gestionás la lista de insumos y los pagos iniciales.</small></span></label>
          </div>}

          <input type="hidden" name="payload" value={payload} />
          {(validationError || state.error) && <p className={styles.error}>{validationError || 'No se pudo crear el evento. Revisá los datos e intentá nuevamente.'}</p>}
          <footer className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => setStep(current => Math.max(current - 1, 0))} disabled={step === 0 || isPending}>Volver</button>
            {step < STEPS.length - 1 ? <button type="button" onClick={nextStep}>Continuar</button> : <button type="submit" disabled={isPending} aria-label={isPending ? 'Creando evento' : undefined}>{isPending ? <Spinner size={20} /> : 'Crear evento'}</button>}
          </footer>
        </section>
      </form>
    </main>
  );
}