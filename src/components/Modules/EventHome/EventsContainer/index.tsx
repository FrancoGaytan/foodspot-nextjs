import EventCard from '@components/Shared/EventCard';
import { IEventHomeDetails, IPublicEvent } from '@models/event';
import { getEventById, getPublicAndPrivateEvents, getPublicEvents } from '@services/eventServiceServer';
import { isUserDebtor } from '@services/userServiceServer';
import { getUserFromCookieServer } from '@utils/cookies/localeCookiesServer';
import { EventHomeFilter } from '../EventsFilters';

interface EventsContainerProps {
  filter: EventHomeFilter;
}

export default async function EventsContainer(props: EventsContainerProps) {
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
        const eventDetails = await getEventById(event._id);
        const currentEvent: IEventHomeDetails = {
          _id: eventDetails._id,
          memberLimit: eventDetails.memberLimit,
          state: eventDetails.state,
          members: eventDetails.members.map(member => ({ _id: member._id })),
          isPrivate: eventDetails.isPrivate,
        };

        return { event, currentEvent };
      } catch (e) {
        console.error(`Error loading event ${event._id}:`, e);
        return { event, currentEvent: null as IEventHomeDetails | null };
      }
    })
  );

  return (
    <>
      {eventsWithDetails
        .filter(({ currentEvent }) => {
          if (!currentEvent) return false;
          if (props.filter === 'subscribed') return Boolean(user && currentEvent.members.some(member => member._id === user.id));

          return currentEvent.state !== 'canceled';
        })
        .map(({ event, currentEvent }) => (
        <EventCard key={event._id} event={event} user={user} currentEvent={currentEvent} debtorEventId={debtorEventId} />
        ))}
    </>
  );
}
