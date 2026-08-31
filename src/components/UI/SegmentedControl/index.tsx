import styles from './styles.module.scss';

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  value: string;
  options: SegmentedControlOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

export default function SegmentedControl(props: SegmentedControlProps) {
  return (
    <div className={styles.control} role="group" aria-label={props.ariaLabel}>
      {props.options.map(option => {
        const isSelected = option.value === props.value;

        return (
          <button
            type="button"
            className={styles.option}
            key={option.value}
            aria-pressed={isSelected}
            onClick={() => props.onChange(option.value)}
          >
            {option.icon && <span className={styles.icon} aria-hidden>{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}