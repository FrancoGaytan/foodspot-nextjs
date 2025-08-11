import styles from './styles.module.scss';
import EventsContainer from './EventsContainer';
import HomeHeader from './HomeHeader';
import { getTranslation } from '@utils/getTranslation';
import { eventImages } from '@utils/eventImages';
import Button from '@components/micro/Button';
import { ButtonKind } from '@components/micro/Button';
import ImageSlider from '@components/macro/Slider';
import HomeInfo from '@components/macro/HomeInfo';

export default async function eventHome() {
  const { t } = await getTranslation('eventHome');
  return (
    <div className={styles.eventHomeContent}>
      <HomeHeader />
      <h1 className={styles.incomingEventTitle}>{t.incomingEvents}</h1>
      <section className={styles.eventsContainer}>
        <EventsContainer />
      </section>
      <section className={styles.carruselContainer}>
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
