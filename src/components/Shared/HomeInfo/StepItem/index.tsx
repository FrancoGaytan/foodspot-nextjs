import Image from 'next/image';
import styles from './styles.module.scss';

interface IStepItem {
  title: string;
  description: string;
  imagePath: string;
}

export default function StepItem(props: IStepItem) {
  return (
    <li className={styles.stepItem}>
      <Image src={props.imagePath} alt="stepItem" width={57} height={57} style={{ width: 57, height: 'auto' }} priority />
      <h1 className={styles.title}>{props.title}</h1>
      <p>{props.description}</p>
    </li>
  );
}
