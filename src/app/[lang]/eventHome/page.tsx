import PrivateFooter from '@components/Shared/layout/PrivateFooter';
import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import EventHome from '@components/Modules/EventHome';

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
