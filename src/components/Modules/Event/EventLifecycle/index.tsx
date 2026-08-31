'use client';

import { EventStatesEnum } from 'enums/EventState.enum';
import { useTranslation } from '@hooks/useTranslation';
import styles from './styles.module.scss';

interface EventLifecycleProps {
  state: string;
}

const STEPS = ['eventOpenStep', 'eventClosedStep', 'eventPaymentStep', 'eventFinishedStep'] as const;

function getActiveStep(state: string): number {
  switch (state) {
    case EventStatesEnum.CLOSED:
      return 1;
    case EventStatesEnum.READY_FOR_PAYMENT:
      return 2;
    case EventStatesEnum.FINISHED:
      return 3;
    default:
      return 0;
  }
}

export default function EventLifecycle(props: EventLifecycleProps) {
  const { t } = useTranslation('eventHome');

  if (props.state === EventStatesEnum.CANCELED) return null;

  const activeStep = getActiveStep(props.state);

  return (
    <section className={styles.lifecycle} aria-label={t.eventLifecycleLabel}>
      <div className={styles.track} aria-hidden>
        <div className={styles.progress} style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }} />
      </div>
      <ol className={styles.steps}>
        {STEPS.map((stepKey, index) => {
          const isComplete = index < activeStep;
          const isCurrent = index === activeStep;

          return (
            <li className={`${styles.step} ${isComplete ? styles.stepComplete : ''} ${isCurrent ? styles.stepCurrent : ''}`} key={stepKey}>
              <span className={styles.dot} aria-hidden>{isComplete ? 'check' : index + 1}</span>
              <span>{t[stepKey]}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}