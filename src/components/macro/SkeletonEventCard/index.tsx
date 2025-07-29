import styles from '../EventCard/styles.module.scss';
import skeleton from './styles.module.scss';

export default function SkeletonEventCard() {
  return <div className={`${styles.cardContainer} ${skeleton.skeletonCard}`}></div>;
}
