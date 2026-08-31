import styles from '../../../components/Modules/EventHome/styles.module.scss';
import HomeHeader from '@components/Modules/EventHome/HomeHeader';
import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import Spinner from '@components/UI/Spinner';
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
          <section className={styles.loadingEventsContainer}>
            <Spinner size={72} />
          </section>
        </div>
      </div>
    </>
  );
}
