import PrivateHeader from '@components/Shared/layout/PrivateHeader';
/* import { getTranslation } from '@utils/common/getTranslation'; */

export default async function LoadingEvent() {
  //const { t } = await getTranslation('eventHome');
  return (
    <>
      <PrivateHeader />
      <div>waiting...</div>
    </>
  );
}
