'use server';

import { IEvent } from '@models/event';
import { IsUserDebtorResponse } from '@models/user';
import {
  deleteEvent,
  editEvent,
  editRoles,
  getEventById,
  getMembersAmount,
  getMembersAndReceiptsInfo,
  subscribeToAnEvent,
  unsubscribeFromEvent,
} from '@services/eventServiceServer';
import { ITransferReceiptInfoResponse, PayCheckInfoResponse } from '@models/transfer';
import { isUserDebtor } from '@services/userServiceServer';
import { getImage } from '@services/purchaseReceiptsServer';
import {
  approvePaymentWithoutReceipt,
  approveTransferReceipts,
  deleteTransferReceipt,
  getTransferReceipt,
} from '@services/transferReceiptsServer';

export async function getEventByIdAction(eventId: string): Promise<IEvent> {
  return await getEventById(eventId);
}

export async function isUserDebtorAction(userId: string): Promise<IsUserDebtorResponse> {
  return await isUserDebtor(userId);
}

export async function subscribeToAnEventAction(userId: string, eventId: string): Promise<IEvent> {
  return await subscribeToAnEvent(userId, eventId);
}

export async function unsubscribeFromEventAction(userId: string, eventId: string): Promise<IEvent> {
  return await unsubscribeFromEvent(userId, eventId);
}

export async function getUserByIdAction(userId: string) {
  const { getUserById } = await import('@services/userServiceServer');
  return await getUserById(userId);
}

export async function getMembersAmountAction(eventId: string): Promise<PayCheckInfoResponse[]> {
  return await getMembersAmount(eventId);
}

export async function getMembersAndReceiptsInfoAction(eventId: string): Promise<ITransferReceiptInfoResponse[]> {
  return await getMembersAndReceiptsInfo(eventId);
}

export async function editRolesAction(eventId: string, event: IEvent): Promise<IEvent> {
  return await editRoles(eventId, event);
}

export async function editEventAction(eventId: string, event: IEvent): Promise<IEvent> {
  return await editEvent(eventId, event);
}

export async function deleteEventAction(eventId: string): Promise<IEvent> {
  return await deleteEvent(eventId);
}

export async function approvePaymentWithoutReceiptAction(userId: string, eventId: string): Promise<void> {
  await approvePaymentWithoutReceipt(userId, eventId);
}

export async function approveTransferReceiptsAction(receiptId: string | undefined, eventId: string): Promise<void> {
  await approveTransferReceipts(receiptId, eventId);
}

export async function deleteTransferReceiptAction(receiptId: string | undefined): Promise<void> {
  await deleteTransferReceipt(receiptId);
}

export async function getTransferReceiptAction(receiptId: string) {
  return await getTransferReceipt(receiptId);
}

export async function getImageAction(imageId: string | undefined): Promise<{ dataUrl: string; fileType: string }> {
  const image = await getImage(imageId);
  const imageBuffer = Buffer.from(await image.arrayBuffer()).toString('base64');

  return {
    dataUrl: `data:${image.type};base64,${imageBuffer}`,
    fileType: image.type.split('/')[1] ?? 'bin',
  };
}