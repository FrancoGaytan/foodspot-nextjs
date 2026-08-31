import styles from './styles.module.scss';
import EventsContainer from './EventsContainer';
import HomeHeader from './HomeHeader';
import { getTranslation } from '@utils/common/getTranslation';
import EventsFilters, { EventHomeFilter } from './EventsFilters';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import { getPendingTransferEventIds } from '@services/userServiceServer';
import PendingTransferWarning from './PendingTransferWarning';

interface EventHomeProps {
  filter?: EventHomeFilter;
  lang: string;
}

export default async function eventHome({ filter = 'available', lang }: EventHomeProps) {
  const { t } = await getTranslation('eventHome', lang);
  const user = await getUserFromCookieServer();
  const pendingTransferEventIds = user ? await getPendingTransferEventIds(user.id).catch(() => []) : [];
  return (
    <div className={styles.eventHomeContent}>
      <HomeHeader />
      <EventsFilters currentFilter={filter} availableLabel={t.availableFilter} subscribedLabel={t.subscribedFilter} />
      <section className={styles.eventsContainer}>
        <EventsContainer filter={filter} />
      </section>
      {pendingTransferEventIds.length > 0 && <PendingTransferWarning eventIds={pendingTransferEventIds} />}
    </div>
  );
}
