'use client';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
  altText?: string;
}

export default function ImageSlider(props: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const total = props.images.length;
  const altText = props.altText ?? 'slide';

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitionEnabled(true);
      setCurrent(prev => (prev === total - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [total]);

  return (
    <div className={styles.slider}>
      <div
        className={styles.sliderTrack}
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transitionEnabled ? 'transform 0.6s ease-in-out' : 'none',
        }}>
        {props.images.map((img, index) => (
          <div key={index} className={styles.slideImageWrapper}>
            <Image src={img} alt={`${altText} ${index + 1}`} fill className={styles.slideImage} sizes="100vw" priority={index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
