import EventCard from '@components/Shared/EventCard';
import { IEvent, IPublicEvent } from '@models/event';
import { getEventById, getPublicAndPrivateEvents, getPublicEvents } from '@services/eventServiceServer';
import { isUserDebtor } from '@services/userServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';

export default async function EventsContainer() {
  const user = await getUserFromCookieServer();
  let eventsToShow: IPublicEvent[] = [];
  let debtorEventId: string | null = null;

  try {
    eventsToShow = user ? await getPublicAndPrivateEvents() : await getPublicEvents();
    if (user) {
      debtorEventId = (await isUserDebtor(user.id)).eventId;
    }
  } catch (e) {
    console.error('Error loading events:', e);
    return null;
  }

  const eventsWithDetails = await Promise.all(
    eventsToShow.map(async event => {
      try {
        return { event, currentEvent: await getEventById(event._id) };
      } catch (e) {
        console.error(`Error loading event ${event._id}:`, e);
        return { event, currentEvent: null as IEvent | null };
      }
    })
  );

  return (
    <>
      {eventsWithDetails.map(({ event, currentEvent }) => (
        <EventCard key={event._id} event={event} user={user} currentEvent={currentEvent} debtorEventId={debtorEventId} />
      ))}
    </>
  );
}
