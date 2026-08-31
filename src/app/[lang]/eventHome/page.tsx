import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import EventHome from '@components/Modules/EventHome';

interface EventHomePageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ filter?: string }>;
}

export default async function EventHomePage(props: EventHomePageProps) {
  const [{ lang }, { filter }] = await Promise.all([props.params, props.searchParams]);
  const currentFilter = filter === 'subscribed' ? 'subscribed' : 'available';

  return (
    <>
      <PrivateHeader />
      <EventHome filter={currentFilter} lang={lang} />
    </>
  );
}
