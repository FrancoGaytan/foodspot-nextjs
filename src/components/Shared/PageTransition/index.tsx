'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';

export default function PageTransition(props: PropsWithChildren) {
  const pathname = usePathname();

  return <div className={styles.pageTransition} key={pathname}>{props.children}</div>;
}