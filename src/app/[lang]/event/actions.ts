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
import { getPendingTransferEventIds, isUserDebtor } from '@services/userServiceServer';
import {
  assignMembersToReceipt,
  createPurchaseReceipt,
  deletePurchaseReceipt,
  getImage,
  getPurchaseReceipts,
  uploadPurchaseReceiptFile,
} from '@services/purchaseReceiptsServer';
import {
  approvePaymentWithoutReceipt,
  approveTransferReceipts,
  deleteTransferReceipt,
  getTransferReceipt,
  createTransferReceipt,
  uploadTransferReceiptFile,
} from '@services/transferReceiptsServer';
import { IPurchaseReceiptRequest, IPurchaseByEvent } from '@models/purchases';
import { ITransferReceiptRequest, ITransferReceiptResponse, IUploadFileResponse } from '@models/transfer';
import { IOption, ISurveyParticipant } from '@models/options';
import { createOption, deleteOption, editOption, getMembersWhoHaventVoted } from '@services/optionsServer';
import { createRating, getRatingFromUser } from '@services/ratingServiceServer';
import { IRatingRequest, IRatingResponse } from '@models/ratings';

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
  try {
    return await getMembersAmount(eventId);
  } catch {
    return [];
  }
}

export async function getMembersAndReceiptsInfoAction(eventId: string): Promise<ITransferReceiptInfoResponse[]> {
  try {
    return await getMembersAndReceiptsInfo(eventId);
  } catch {
    return [];
  }
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

export async function createTransferReceiptAction(
  eventId: string,
  payload: Omit<ITransferReceiptRequest, 'file'> & { receiver: string }
): Promise<ITransferReceiptResponse> {
  return await createTransferReceipt(eventId, payload);
}

export async function uploadTransferReceiptFileAction(receiptId: string, file: File): Promise<IUploadFileResponse> {
  return await uploadTransferReceiptFile(receiptId, file);
}

export async function createPurchaseReceiptAction(
  eventId: string,
  payload: Omit<IPurchaseReceiptRequest, 'file'>
) {
  return await createPurchaseReceipt(eventId, payload);
}

export async function uploadPurchaseReceiptFileAction(receiptId: string, file: File): Promise<{ imageId: string }> {
  return await uploadPurchaseReceiptFile(receiptId, file);
}

export async function deletePurchaseReceiptAction(receiptId: string, eventId: string) {
  return await deletePurchaseReceipt(receiptId, eventId);
}

export async function assignMembersToReceiptAction(payload: { receipts: IPurchaseByEvent[] }) {
  return await assignMembersToReceipt(payload);
}

export async function createOptionAction(eventId: string, title: string): Promise<IOption> {
  return await createOption(eventId, title);
}

export async function editOptionAction(optionId: string, payload: { title?: string; participants?: string[] }): Promise<IOption> {
  return await editOption(optionId, payload);
}

export async function deleteOptionAction(optionId: string): Promise<IOption> {
  return await deleteOption(optionId);
}

export async function getMembersWhoHaventVotedAction(eventId: string): Promise<{ membersWhoHaventVoted: ISurveyParticipant[] }> {
  return await getMembersWhoHaventVoted(eventId);
}

export async function getPurchaseReceiptsAction(eventId: string) {
  return await getPurchaseReceipts(eventId);
}

export async function getPendingTransferEventIdsAction(userId: string): Promise<string[]> {
  return await getPendingTransferEventIds(userId);
}

export async function createRatingAction(eventId: string, userId: string, payload: IRatingRequest): Promise<IRatingResponse> {
  return await createRating(eventId, userId, payload);
}

export async function getRatingFromUserAction(eventId: string, userId: string): Promise<IRatingResponse> {
  return await getRatingFromUser(eventId, userId);
}