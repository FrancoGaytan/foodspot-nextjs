import { IEvent } from '@models/event';
import { ITransferReceiptInfoResponse, PayCheckInfoResponse } from '@models/transfer';
import { IUser } from '@models/user';
import { EventStatesEnum } from 'enums/EventState.enum';

/* export interface useEventParams {
  eventId: string;
  userId: string;
}

export async function getEventContext(props: useEventParams) {
  const event = await getEventById(props.eventId);
  const user = await getUserById(props.userId);
  const eventPaymentInfo = await getMembersAmount(event._id);
  const eventParticipantsInfo = await getMembersAndReceiptsInfo(event._id);
  const myInfo = eventPaymentInfo.find((member: PayCheckInfoResponse) => member.userId === props.userId);

  return { event, user, eventPaymentInfo, eventParticipantsInfo, myInfo, props };
}

// Exporta cada función individualmente, recibiendo el contexto necesario
 */
export function showDeleteEventBtn(event: IEvent, user: IUser): boolean {
  return userIsTheOrganizer(event, user);
}

export function isUserIntoEvent(event: IEvent, user: IUser): boolean {
  return event.members.some((member: IUser) => member._id === user._id);
}

export function userIsAShoppingDesignee(event: IEvent, user: IUser): boolean {
  return event.shoppingDesignee.some((designee: IUser) => designee._id === user._id);
}

export function userIsTheOrganizer(event: IEvent, user: IUser): boolean {
  return event.organizer._id === user._id;
}

export function checkIfUserHasUploaded(eventParticipantsInfo: ITransferReceiptInfoResponse[], userId: string): boolean {
  const myReceipt = eventParticipantsInfo.find(member => member.userId === userId);
  return !!myReceipt?.hasUploaded;
}

export function showCloseEventBtn(event: IEvent, user: IUser): boolean {
  return (
    isUserIntoEvent(event, user) &&
    (event.organizer._id === user._id || userIsAShoppingDesignee(event, user)) &&
    (event.state === EventStatesEnum.AVAILABLE || event.state === EventStatesEnum.READYFORPAYMENT)
  );
}

export function showReopenEventBtn(event: IEvent, user: IUser): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.CLOSED &&
    (event.organizer._id === user._id || userIsAShoppingDesignee(event, user))
  );
}

export function showParticipationBtn(event: IEvent, user: IUser): boolean {
  return !isUserIntoEvent(event, user) && event.state === EventStatesEnum.AVAILABLE && event.members.length < event.memberLimit;
}

export function showQuitEventBtn(event: IEvent, user: IUser): boolean {
  return isUserIntoEvent(event, user) && event.state === EventStatesEnum.AVAILABLE;
}

export function showNewPurchaseReceiptBtn(event: IEvent, user: IUser): boolean {
  return isUserIntoEvent(event, user) && event.state === EventStatesEnum.CLOSED && userIsAShoppingDesignee(event, user);
}

export function showReadyToPayBtn(event: IEvent, user: IUser): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.CLOSED &&
    (userIsTheOrganizer(event, user) || userIsAShoppingDesignee(event, user)) &&
    event.purchaseReceipts.length > 0
  );
}

export function showPayBtn(
  event: IEvent,
  user: IUser,
  eventParticipantsInfo: ITransferReceiptInfoResponse[],
  myInfo: PayCheckInfoResponse | undefined
): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.READYFORPAYMENT &&
    event.purchaseReceipts.length > 0 &&
    !checkIfUserHasUploaded(eventParticipantsInfo, user._id) &&
    typeof myInfo?.amount === 'number' &&
    myInfo.amount > 0
  );
}

export function showModifyPayBtn(event: IEvent, user: IUser, eventParticipantsInfo: ITransferReceiptInfoResponse[], myInfo: any): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.READYFORPAYMENT &&
    event.purchaseReceipts.length > 0 &&
    checkIfUserHasUploaded(eventParticipantsInfo, user._id) &&
    typeof myInfo?.amount === 'number' &&
    myInfo.amount > 0
  );
}
