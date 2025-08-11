import SkeletonEventCard from '@components/Shared/SkeletonEventCard';
import styles from '../../../components/pages/EventHome/styles.module.scss';
import HomeHeader from '@components/Modules/EventHome/HomeHeader';
import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import { getTranslation } from '@utils/common/getTranslation';

export default async function LoadingEventHome() {
  const { t } = await getTranslation('eventHome');
  return (
    <>
      <PrivateHeader />
      <div className={styles.eventHomeContent}>
        <HomeHeader />
        <div className={styles.eventHomeContent}>
          <div className={styles.incomingEventTitle}>{t.incomingEvents}</div>
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
