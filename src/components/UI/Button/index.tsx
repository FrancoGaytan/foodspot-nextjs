import { PropsWithChildren, ButtonHTMLAttributes, JSX } from 'react';
import styles from './styles.module.scss';
import { className } from '../../../utils/common/className';

export type TSize = 'micro' | 'small' | 'short' | 'medium' | 'large' | 'full'; //trata de importarlo bien despoues, desde size

export enum ButtonKind {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  VALIDATION = 'validation',
  WHITE_PRIMARY = 'whitePrimary',
  WHITE_SECONDARY = 'whiteSecondary',
}

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind?:
    | ButtonKind.PRIMARY
    | ButtonKind.SECONDARY
    | ButtonKind.TERTIARY
    | ButtonKind.VALIDATION
    | ButtonKind.WHITE_PRIMARY
    | ButtonKind.WHITE_SECONDARY;
  size?: TSize;
}

export default function Button(props: PropsWithChildren<IButtonProps>): JSX.Element {
  const buttonProps = { ...props };
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.kind;
  delete buttonProps.size;

  const baseClasses = [styles.button, styles[`size-${props.size ?? 'auto'}`]];

  const conditionalClasses = {
    [styles.primary]: props.kind === 'primary',
    [styles.secondary]: props.kind === 'secondary',
    [styles.tertiary]: props.kind === 'tertiary',
    [styles.validation]: props.kind === 'validation',
    [styles.whitePrimary]: props.kind === 'whitePrimary',
    [styles.whiteSecondary]: props.kind === 'whiteSecondary',
    [props.className ?? '']: !!props.className,
  };

  return (
    <button {...buttonProps} {...className(baseClasses, conditionalClasses)} style={props.style}>
      {props.children}
    </button>
  );
}
