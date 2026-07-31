import LinkCustom from '@components/UI/LinkCustom';
import styles from './styles.module.scss';

export type EventHomeFilter = 'available' | 'subscribed';

interface EventsFiltersProps {
  currentFilter: EventHomeFilter;
  availableLabel: string;
  subscribedLabel: string;
}

export default function EventsFilters(props: EventsFiltersProps) {
  return (
    <nav className={styles.filters} aria-label="Filtros de eventos">
      <LinkCustom
        href="/eventHome?filter=available"
        className={`${styles.filterButton} ${props.currentFilter === 'available' ? styles.filterAvailable : ''}`}>
        {props.availableLabel}
      </LinkCustom>
      <LinkCustom
        href="/eventHome?filter=subscribed"
        className={`${styles.filterButton} ${props.currentFilter === 'subscribed' ? styles.filterSubscribed : ''}`}>
        {props.subscribedLabel}
      </LinkCustom>
    </nav>
  );
}