'use client';

import styles from './styles.module.scss';
import { useCustomRouter } from '@hooks/useCustomRouter';
import Image from 'next/image';

interface LogButtonProps {
  image: string;
  className?: string;
}

export default function ProfileButton(props: LogButtonProps) {
  const { pushTo } = useCustomRouter();
  const handleGoToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    pushTo(`/userProfile`);
  };

  return (
    <Image
      className={`${styles.profileBtn} ${props.className ?? ''}`}
      src={props.image}
      alt="profile"
      onClick={handleGoToProfile}
      width={40}
      height={40}
      unoptimized
    />
  );
}
