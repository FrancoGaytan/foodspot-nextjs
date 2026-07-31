import { JSX, PropsWithChildren } from 'react';
import styles from './styles.module.scss';
import LinkCustom from '@components/UI/LinkCustom';

export default function FormLayout(props: PropsWithChildren): JSX.Element {
  return (
    <div className={styles.formLayout}>
      <header className={styles.publicHeader}>
        <LinkCustom href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden />
          FoodSpot
        </LinkCustom>
        <LinkCustom href="/login" className={styles.loginLink}>
          Login
        </LinkCustom>
      </header>
      <div className={styles.containerLayout}>
        <LinkCustom href="/eventHome" className={styles.closeBtn} aria-label="Close" />
        <div className={styles.formBrand}>
          <span className={styles.formBrandMark} aria-hidden />
          <span>FoodSpot</span>
        </div>
        {props.children}
      </div>
    </div>
  );
}
