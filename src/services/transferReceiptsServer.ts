import { ITransferReceiptResponse } from '@models/transfer';
import { deleteServer, getServer, postFileServer, postServer, putServer } from './httpServer';
import { ITransferReceiptRequest, IUploadFileResponse } from '@models/transfer';

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

export async function createTransferReceipt(
  eventId: string,
  payload: Omit<ITransferReceiptRequest, 'file'> & { receiver: string },
  signal?: AbortSignal
): Promise<ITransferReceiptResponse> {
  const url = `/transferReceipts/createTransferReceipt/${eventId}`;
  return await postServer<ITransferReceiptResponse, typeof payload>(url, payload, signal);
}

export async function uploadTransferReceiptFile(
  receiptId: string,
  file: File,
  signal?: AbortSignal
): Promise<IUploadFileResponse> {
  return await postFileServer<IUploadFileResponse>(`/transferReceipts/uploadFile/${receiptId}`, file, signal);
}
