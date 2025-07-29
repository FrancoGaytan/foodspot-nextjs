import SkeletonEventCard from '@components/macro/SkeletonEventCard';
import styles from '../../../components/pages/EventHome/styles.module.scss';
import HomeHeader from '@components/pages/EventHome/HomeHeader';
import PrivateHeader from '@components/macro/layout/PrivateHeader';

export default function LoadingEventHome() {
  return (
    <>
      <PrivateHeader />
      <div className={styles.eventHomeContent}>
        <HomeHeader />
        <div className={styles.eventHomeContent}>
          <div className={styles.incomingEventTitle}>Cargando eventos...</div>
          <section className={styles.eventsContainer}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonEventCard key={i} />
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
