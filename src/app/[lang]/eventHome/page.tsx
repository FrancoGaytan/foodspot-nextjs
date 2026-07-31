import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import EventHome from '@components/Modules/EventHome';

interface EventHomePageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function EventHomePage(props: EventHomePageProps) {
  const { filter } = await props.searchParams;
  const currentFilter = filter === 'subscribed' ? 'subscribed' : 'available';

  return (
    <>
      <PrivateHeader />
      <EventHome filter={currentFilter} />
    </>
  );
}
