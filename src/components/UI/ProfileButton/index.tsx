'use client';

import styles from './styles.module.scss';
import { useCustomRouter } from '@hooks/useCustomRouter';
import Image from 'next/image';

interface LogButtonProps {
  image: File | undefined;
}

export default function ProfileButton(props: LogButtonProps) {
  const { pushTo } = useCustomRouter();
  const image = props.image;

  const handleGoToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    pushTo(`/userProfile`);
  };

  return image instanceof Blob ? (
    <Image
      className={styles.profileBtn}
      src={image ? URL.createObjectURL(image) : '/images/icons/profile.png'}
      alt="profile"
      onClick={handleGoToProfile}
      width={40}
      height={40}
    />
  ) : (
    <Image src="/images/icons/profile.png" className={styles.profileBtn} alt="placeholder" width={40} height={40} onClick={handleGoToProfile} />
  );
}
