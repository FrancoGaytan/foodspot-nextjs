import { IEvent } from '@models/event';
import { ITransferReceiptInfoResponse, PayCheckInfoResponse } from '@models/transfer';
import { IPublicUser } from '@models/user';
import { EventStatesEnum } from 'enums/EventState.enum';

export function showDeleteEventBtn(event: IEvent, user: IPublicUser): boolean {
  return userIsTheOrganizer(event, user);
}

export function isUserIntoEvent(event: IEvent, user: IPublicUser): boolean {
  return event.members.some((member: IPublicUser) => member._id === user._id);
}

export function userIsAShoppingDesignee(event: IEvent, user: IPublicUser): boolean {
  return event.shoppingDesignee.some((designee: IPublicUser) => designee._id === user._id);
}

export function userIsTheOrganizer(event: IEvent, user: IPublicUser): boolean {
  return event.organizer._id === user._id;
}

export function checkIfUserHasUploaded(eventParticipantsInfo: ITransferReceiptInfoResponse[], userId: string): boolean {
  const myReceipt = eventParticipantsInfo.find(member => member.userId === userId);
  return !!myReceipt?.hasUploaded;
}

export function showCloseEventBtn(event: IEvent, user: IPublicUser): boolean {
  return (
    isUserIntoEvent(event, user) &&
    (event.organizer._id === user._id || userIsAShoppingDesignee(event, user)) &&
    (event.state === EventStatesEnum.AVAILABLE || event.state === EventStatesEnum.READY_FOR_PAYMENT)
  );
}

export function showReopenEventBtn(event: IEvent, user: IPublicUser): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.CLOSED &&
    (event.organizer._id === user._id || userIsAShoppingDesignee(event, user))
  );
}

export function showParticipationBtn(event: IEvent, user: IPublicUser): boolean {
  return !isUserIntoEvent(event, user) && event.state === EventStatesEnum.AVAILABLE && event.members.length < event.memberLimit;
}

export function showQuitEventBtn(event: IEvent, user: IPublicUser): boolean {
  return isUserIntoEvent(event, user) && event.state === EventStatesEnum.AVAILABLE;
}

export function showNewPurchaseReceiptBtn(event: IEvent, user: IPublicUser): boolean {
  return isUserIntoEvent(event, user) && event.state === EventStatesEnum.CLOSED && userIsAShoppingDesignee(event, user);
}

export function showReadyToPayBtn(event: IEvent, user: IPublicUser): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.CLOSED &&
    (userIsTheOrganizer(event, user) || userIsAShoppingDesignee(event, user)) &&
    event.purchaseReceipts.length > 0
  );
}

export function showPayBtn(
  event: IEvent,
  user: IPublicUser,
  eventParticipantsInfo: ITransferReceiptInfoResponse[],
  myInfo: PayCheckInfoResponse | undefined
): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.READY_FOR_PAYMENT &&
    event.purchaseReceipts.length > 0 &&
    !checkIfUserHasUploaded(eventParticipantsInfo, user._id) &&
    typeof myInfo?.amount === 'number' &&
    myInfo.amount > 0
  );
}

export function showModifyPayBtn(event: IEvent, user: IPublicUser, eventParticipantsInfo: ITransferReceiptInfoResponse[], myInfo: any): boolean {
  return (
    isUserIntoEvent(event, user) &&
    event.state === EventStatesEnum.READY_FOR_PAYMENT &&
    event.purchaseReceipts.length > 0 &&
    checkIfUserHasUploaded(eventParticipantsInfo, user._id) &&
    typeof myInfo?.amount === 'number' &&
    myInfo.amount > 0
  );
}
