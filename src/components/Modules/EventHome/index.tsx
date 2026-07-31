import styles from './styles.module.scss';
import EventsContainer from './EventsContainer';
import HomeHeader from './HomeHeader';
import { getTranslation } from '@utils/common/getTranslation';
import { eventImages } from '@utils/common/eventImages';
import Button from '@components/UI/Button';
import { ButtonKind } from '@components/UI/Button';
import ImageSlider from '@components/Shared/Slider';
import HomeInfo from '@components/Shared/HomeInfo';
import EventsFilters, { EventHomeFilter } from './EventsFilters';

interface EventHomeProps {
  filter?: EventHomeFilter;
}

export default async function eventHome({ filter = 'available' }: EventHomeProps) {
  const { t } = await getTranslation('eventHome');
  return (
    <div className={styles.eventHomeContent}>
      <HomeHeader />
      <EventsFilters currentFilter={filter} availableLabel={t.availableFilter} subscribedLabel={t.subscribedFilter} />
      <section className={styles.eventsContainer}>
        <EventsContainer filter={filter} />
      </section>
      <section className={styles.carouselContainer}>
        <ImageSlider images={eventImages} altText="Event image" />
        <div className={styles.appDescription}>
          <h1 className={styles.participationInfoTitle}>{t.participationInfoTitle}</h1>
          <p className={styles.participationInfoDescription}>{t.participationInfoDescription}</p>

          <div className={styles.buttonContainer}>
            <Button kind={ButtonKind.PRIMARY} size="large">
              {t.moreAbout}
            </Button>
          </div>
        </div>
      </section>
      <section className={styles.homeInfoContainer}>
        <HomeInfo />
      </section>
    </div>
  );
}
