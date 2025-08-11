'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';
import { useTranslation } from '@hooks/useTranslation';

interface LinkCustomProps extends LinkProps {
  className?: string;
  id?: string;
}

export default function LinkCustom(props: PropsWithChildren<LinkCustomProps>) {
  const { lang } = useTranslation('navigation');

  const langPrefix = `/${lang}`;
  const hrefValue = typeof props.href === 'string' ? props.href : props.href.pathname || '';
  const resolvedHref = `${langPrefix}${hrefValue}`.replace(/\/{2,}/g, '/');

  return (
    <Link
      href={resolvedHref}
      className={props.className}
      id={props.id}
      replace={props.replace}
      scroll={props.scroll}
      shallow={props.shallow}
      prefetch={props.prefetch}
      locale={props.locale}>
      {props.children}
    </Link>
  );
}
