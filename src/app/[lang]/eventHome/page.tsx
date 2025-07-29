import PrivateFooter from '@components/macro/layout/PrivateFooter';
import PrivateHeader from '@components/macro/layout/PrivateHeader';
import EventHome from '@components/pages/EventHome';

export default async function EventHomePage() {
  return (
    <>
      <PrivateHeader />
      <EventHome />
      {/* next */}
      <PrivateFooter />
    </>
  );
}
