import { ITransferReceiptResponse } from '@models/transfer';
import { deleteServer, getServer, postServer, putServer } from './httpServer';

export async function approvePaymentWithoutReceipt(idUser: string, idEvent: string, signal?: AbortSignal): Promise<ITransferReceiptResponse> {
  const url = `/transferReceipts/approvePaymentWithoutReceipt/${idEvent}/${idUser}`;
  return await postServer<ITransferReceiptResponse>(url, undefined, signal);
}

export async function approveTransferReceipts(
  idTransferReceipt: string | undefined,
  idEvent: string,
  signal?: AbortSignal
): Promise<ITransferReceiptResponse> {
  const url = `/transferReceipts/approveTransferReceipt/${idTransferReceipt}/${idEvent}`;
  return await putServer<ITransferReceiptResponse>(url, undefined, signal);
}

export async function deleteTransferReceipt(idTransferReceipt: string | undefined, signal?: AbortSignal): Promise<ITransferReceiptResponse> {
  const url = `/transferReceipts/deleteTransferReceipt/${idTransferReceipt}`;
  return await deleteServer<ITransferReceiptResponse>(url, signal);
}

export async function getTransferReceipt(idTransferReceipt?: string, signal?: AbortSignal): Promise<ITransferReceiptResponse> {
  const url = `/transferReceipts/getTransferReceiptsById/${idTransferReceipt}`;
  return await getServer<ITransferReceiptResponse>(url, signal);
}
