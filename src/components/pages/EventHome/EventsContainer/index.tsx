import EventCard from '@components/macro/EventCard';
import { IPublicEvent } from '@models/event';
import { getPublicAndPrivateEvents, getPublicEvents } from '@services/eventServiceServer';
import { getUserFromCookieServer } from '@utils/localeCookiesServer';

export default async function EventsContainer() {
  const user = await getUserFromCookieServer();
  let eventsToShow: IPublicEvent[] = [];

  try {
    eventsToShow = user ? await getPublicAndPrivateEvents() : await getPublicEvents();
  } catch (e) {
    console.error('Error loading events:', e);
    return null;
  }

  return (
    <>
      {eventsToShow.map(event => (
        <EventCard key={event._id} event={event} user={user} />
      ))}
    </>
  );
}
