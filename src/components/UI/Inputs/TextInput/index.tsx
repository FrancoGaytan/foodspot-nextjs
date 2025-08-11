import styles from './styles.module.scss';

interface TextInputProps {
  label: string;
  placeholder: string;
  name: string;
  className?: string;
}

export default function TextInput(props: TextInputProps) {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={props.name}>
        {props.label}
      </label>
      <input type="text" id={props.name} name={props.name} className={`${styles.input} ${props.className ?? ''}`} placeholder={props.placeholder} />
    </div>
  );
}
