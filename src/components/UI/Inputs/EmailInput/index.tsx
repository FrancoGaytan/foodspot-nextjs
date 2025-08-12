import styles from './styles.module.scss';

interface EmailInputProps {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  darkInput?: boolean;
  defaultValue?: string;
}

export function EmailInput(props: EmailInputProps) {
  return (
    <>
      <label htmlFor={props.name} className={`${styles.loginLabel} ${props.darkInput ? styles.darkLabel : ''}`}>
        {props.label}
      </label>
      <input
        id={props.name}
        name="email"
        className={`${styles.loginInput} ${props.darkInput ? styles.darkInput : ''} ${props.className ?? ''}`}
        placeholder={props.placeholder}
        type="email"
        defaultValue={props.defaultValue}
        aria-label={props.label}
      />
    </>
  );
}
