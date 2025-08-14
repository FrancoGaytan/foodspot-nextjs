import PrivateFooter from '@components/Shared/layout/PrivateFooter';
import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import Event from '@components/Modules/Event';

export default async function EventPage(props: { params: { id: string } }) {
  return (
    <>
      <PrivateHeader />
      <Event params={props.params} />
      <PrivateFooter />
    </>
  );
}
