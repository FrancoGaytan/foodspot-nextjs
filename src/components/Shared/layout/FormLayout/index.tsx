import { JSX, PropsWithChildren } from 'react';
import styles from './styles.module.scss';
import LinkCustom from '@components/UI/LinkCustom';

export default function FormLayout(props: PropsWithChildren): JSX.Element {
  return (
    <div className={styles.formLayout}>
      <div className={styles.containerLayout}>
        <LinkCustom href="/eventHome" className={styles.closeBtn} aria-label="Close" />
        {props.children}
      </div>
    </div>
  );
}
