import { IEvent } from '@models/event';
import styles from './styles.module.scss';
import { getTranslation } from '@utils/common/getTranslation';
import { isUserIntoEvent } from '../EventBtns/eventBtnsActions';
import { getUserById } from '@services/userServiceServer';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import { getPurchaseReceipts } from '@services/purchaseReceiptsServer';
import PurchasesList from './PurchasesList';

interface PurchasesDataProps {
  event: IEvent;
  user: IUserFromCookie;
}

export default async function PurchasesData(props: PurchasesDataProps) {
  const event = props.event;
  const user = await getUserById(props.user?.id);
  const purchasesMade = isUserIntoEvent(event, user) ? await getPurchaseReceipts(props.event._id) : [];
  const { t } = await getTranslation('eventHome');

  return (
    <div className={styles.purchaseDataContainer}>
      <section className={styles.purchaseDataTitle}>
        <div className={styles.purchaseLogo}></div>
        <h3 className={styles.logoTitle}>{t.organizationTitle}</h3>
      </section>
      {isUserIntoEvent(event, user) && (
        <PurchasesList
          purchases={purchasesMade}
          eventId={event._id}
          canDelete={event.state === 'closed' && event.shoppingDesignee.some(designee => designee._id === user._id)}
        />
      )}
    </div>
  );
}
