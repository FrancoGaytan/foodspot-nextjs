'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';

interface SpinnerProps {
  size?: number;
  speed?: string;
}

const defaultSpinnerProps: Required<SpinnerProps> = {
  size: 72,
  speed: '1.2s',
};

export default function Spinner(props: SpinnerProps) {
  const size = Math.max(props.size ?? defaultSpinnerProps.size, defaultSpinnerProps.size);
  const speed = props.speed ?? defaultSpinnerProps.speed;

  return (
    <span className={styles.overlay} role="status" aria-label="Cargando" aria-live="polite">
      <span className={styles.spinner} style={{ width: size, height: size, '--spinner-speed': speed } as React.CSSProperties}>
        <span className={styles.smoke} aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <Image
          src="/images/icons/logo-rojo.png"
          alt=""
          width={size}
          height={size}
          className={styles.flame}
          aria-hidden
        />
      </span>
    </span>
  );
}
