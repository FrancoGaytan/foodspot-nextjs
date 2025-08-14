import { PayCheckInfoResponse } from '@models/transfer';
import { getEventById, getMembersAmount, getMembersAndReceiptsInfo } from '@services/eventServiceServer';
import { getUserById } from '@services/userServiceServer';
import { EventStatesEnum } from 'enums/EventState.enum';

interface useEventParams {
  eventId: string;
  userId: string;
}

export async function getButtonsInfo(props: useEventParams) {
  const event = await getEventById(props.eventId);
  const user = await getUserById(props.userId);
  const eventPaymentInfo = await getMembersAmount(event._id);
  const eventParticipantsInfo = await getMembersAndReceiptsInfo(event._id);
  const myInfo = eventPaymentInfo.find((member: PayCheckInfoResponse) => member.userId === props.userId);

  function showDeleteEventBtn(): boolean {
    return event.organizer._id === user._id;
  }

  function isUserIntoEvent(): boolean {
    //ver cuales de estas funciones pueden estar afuera de este hook
    return event.members.some(member => member._id === user._id);
  }

  function userIsAShoppingDesignee(): boolean {
    return event.shoppingDesignee.some(designee => designee._id === user._id);
  }

  function checkIfUserHasUploaded(): boolean {
    const myReceipt = eventParticipantsInfo.find(member => member.userId === props.userId);
    return !!myReceipt?.hasUploaded;
  }

  function showCloseEventBtn(): boolean {
    //chequear que esta condicion sea correcta
    return (
      isUserIntoEvent() &&
      (event.organizer._id === user._id || userIsAShoppingDesignee()) &&
      (event.state === EventStatesEnum.AVAILABLE || event.state === EventStatesEnum.READYFORPAYMENT)
    );
  }

  function showReopenEventBtn(): boolean {
    return isUserIntoEvent() && event.state === EventStatesEnum.CLOSED && (event.organizer._id === user._id || userIsAShoppingDesignee());
  }

  function showParticipationBtn(): boolean {
    return !isUserIntoEvent() && event.state === EventStatesEnum.AVAILABLE && event.members.length < event.memberLimit;
  }

  function showQuitEventBtn(): boolean {
    return isUserIntoEvent() && event.state === EventStatesEnum.AVAILABLE;
  }

  function showNewPurchaseReceiptBtn(): boolean {
    return isUserIntoEvent() && event.state === EventStatesEnum.CLOSED && userIsAShoppingDesignee();
  }

  function showReadyToPayBtn(): boolean {
    return isUserIntoEvent() && event.state === EventStatesEnum.CLOSED && userIsAShoppingDesignee() && event.purchaseReceipts.length > 0;
  }

  function showPayBtn(): boolean {
    return (
      isUserIntoEvent() &&
      event.state === EventStatesEnum.READYFORPAYMENT &&
      event.purchaseReceipts.length > 0 &&
      !checkIfUserHasUploaded() &&
      typeof myInfo?.amount === 'number' &&
      myInfo.amount > 0
    );
  }

  function showModifyPayBtn(): boolean {
    return (
      isUserIntoEvent() &&
      event.state === EventStatesEnum.READYFORPAYMENT &&
      event.purchaseReceipts.length > 0 &&
      checkIfUserHasUploaded() &&
      typeof myInfo?.amount === 'number' &&
      myInfo.amount > 0
    );
  }

  const showBtns = {
    deleteBtn: showDeleteEventBtn(),
    closeBtn: showCloseEventBtn(),
    reopenBtn: showReopenEventBtn(),
    participateBtn: showParticipationBtn(),
    quitBtn: showQuitEventBtn(),
    newPurchaseReceiptBtn: showNewPurchaseReceiptBtn(),
    readyToPayBtn: showReadyToPayBtn(),
    payBtn: showPayBtn(),
    modifyPayBtn: showModifyPayBtn(),
  };

  return { showBtns };
}
