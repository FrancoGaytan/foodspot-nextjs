import { IEvent } from '@models/event';
import { IPurchaseReceipt } from '@models/purchases';
import styles from './styles.module.scss';
import { getTranslation } from '@utils/common/getTranslation';
import { isUserIntoEvent } from '../EventBtns/eventBtnsActions';
import { getUserById } from '@services/userServiceServer';
import { IUserFromCookie } from '@utils/cookies/localeCookies';
import { IUser } from '@models/user';
import { EventStatesEnum } from 'enums/EventState.enum';
import { getPurchaseReceipts } from '@services/purchaseReceiptsServer';

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
        <section className={styles.purchasesList}>
          {purchasesMade.map((purchase: IPurchaseReceipt) => (
            <div key={purchase?._id} className={styles.purchasesRow}>
              <span>{purchase.description}</span>
              <span>{purchase.shoppingDesignee.name}</span>
              <span>{'$ ' + purchase.amount}</span>
              {event.shoppingDesignee?.some((d: IUser) => d._id === user?._id) && event.state === EventStatesEnum.CLOSED && (
                <button
                  className={styles.deleteBtn}
                  onClick={e => {
                    e.preventDefault();
                    console.log(purchase);
                  }}></button>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
