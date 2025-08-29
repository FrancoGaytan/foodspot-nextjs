'use client';
import { PropsWithChildren, ButtonHTMLAttributes, JSX } from 'react';
import styles from './styles.module.scss';
import { className } from '@utils/common/className';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind: 'assign' | 'unAssign' | 'add';
}

export default function AssignBtn(props: PropsWithChildren<IButtonProps>): JSX.Element {
  return (
    <div className={styles.assignContainer}>
      <button
        onClick={props.onClick}
        {...className(styles.button, {
          [styles.assign]: props.kind === 'assign',
          [styles.unAssign]: props.kind === 'unAssign',
          [styles.add]: props.kind === 'add',
        })}
        style={{ ...props.style }}
        id={props.id}
      />
    </div>
  );
}
