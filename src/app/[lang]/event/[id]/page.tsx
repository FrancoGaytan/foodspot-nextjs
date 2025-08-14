import PrivateFooter from '@components/Shared/layout/PrivateFooter';
import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import Event from '@components/Modules/Event';

export default async function EventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <>
      <PrivateHeader />
      <Event params={params} />
      <PrivateFooter />
    </>
  );
}
