'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { getBrowserName } from '@utils/common/clientUtilities';

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  defaultValue?: string;
}

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [canRenderEye, setCanRenderEye] = useState(false);

  useEffect(() => {
    const browser = getBrowserName();
    setCanRenderEye(browser !== 'Edge');
  }, []);

  return (
    <>
      <label htmlFor={props.name} className={styles.loginLabel}>
        {props.label}
      </label>
      <section className={styles.inputPasswordSection}>
        <input
          id={props.name}
          name={props.name ?? 'password'}
          ref={inputRef}
          className={`${styles.loginInput} ${props.className ?? ''}`}
          placeholder={props.placeholder}
          type={!canRenderEye ? 'password' : showPassword ? 'password' : 'text'}
          defaultValue={props.defaultValue}
          aria-label={props.label}
        />
        {canRenderEye && (
          <div
            className={styles.passwordEye}
            onClick={() => {
              setShowPassword(!showPassword);
              setTimeout(() => {
                inputRef.current?.focus();
                const length = inputRef.current?.value.length ?? 0;
                inputRef.current?.setSelectionRange(length, length);
              }, 0);
            }}
          />
        )}
        {canRenderEye && !showPassword && <div className={styles.passwordEyeCrossedLine}></div>}
      </section>
    </>
  );
}
