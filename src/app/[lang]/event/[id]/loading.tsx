import PrivateHeader from '@components/Shared/layout/PrivateHeader';
import Spinner from '@components/UI/Spinner';
/* import { getTranslation } from '@utils/common/getTranslation'; */

export default async function LoadingEvent() {
  //const { t } = await getTranslation('eventHome');
  return (
    <>
      <PrivateHeader />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spinner size={64} />
      </div>
    </>
  );
}
