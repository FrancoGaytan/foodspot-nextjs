import { IEvent } from '@models/event';
import styles from './styles.module.scss';
import { getTranslation } from '@utils/common/getTranslation';
import { getOnlyDate, getOnlyHour } from '@utils/common/utilities';
import CopyLinkBtn from '@components/Modules/Event/EventData/CopyLinkBtn';
import EditEventBtn from '@components/Modules/Event/EventData/EditEventBtn';

interface EventDataProps {
  event: IEvent;
  userId?: string;
}

export default async function EventData(props: EventDataProps) {
  const event = props.event;
  const { t } = await getTranslation('eventHome');

  return (
    <div className={styles.eventDataContainer}>
      {event.organizer?._id === props.userId && <EditEventBtn event={event} />}
      {!event.isPrivate && <CopyLinkBtn />}
      <section className={styles.eventDataTitle}>
        <div className={styles.calendarLogo}></div>
        <h3 className={styles.logoTitle}>{t.organizationTitle}</h3>
      </section>
      <p className={styles.infoData}>
        {t.date} {getOnlyDate(new Date(event.datetime))}
      </p>

      <p className={styles.infoData}>
        {t.time} {getOnlyHour(new Date(event.datetime))}
      </p>

      <p className={styles.infoData}>
        {t.organizer} {event.organizer.name}
      </p>

      <p className={styles.infoData}>
        {t.penalizationAmount + ':'} {event.penalization ? '$' + event.penalization : t.noPenalizationAmount}
      </p>

      {event.penalization > 0 && (
        <p className={styles.infoData}>
          {t.penalizationStartDate} {getOnlyDate(new Date(event.penalizationStartDate))}
        </p>
      )}

      <section className={styles.eventDataTitle}>
        <div className={styles.restaurantLogo}></div>
        <h3 className={styles.logoTitle}>{t.menu}</h3>
      </section>

      <p className={styles.infoData}>{event.description}</p>
    </div>
  );
}
