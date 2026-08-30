import { IPurchaseReceipt, IPurchaseReceiptRequest, IPurchaseAssignmentResponse, IPurchaseByEvent } from '@models/purchases';
import { getFileServer, getServer, postFileServer, postServer, putServer, deleteServer } from './httpServer';

export async function getPurchaseReceipts(event: string | undefined, signal?: AbortSignal): Promise<IPurchaseReceipt[]> {
  const url = `/purchaseReceipts/getPurchaseReceiptsByEvent/${event}`;
  return await getServer(url, signal);
}

export async function getImage(idImage: string | undefined, signal?: AbortSignal): Promise<Blob> {
  const url = `/images/getImage/${idImage}`;
  return await getFileServer(url, signal);
}

export async function createPurchaseReceipt(eventId: string, payload: Omit<IPurchaseReceiptRequest, 'file'>, signal?: AbortSignal): Promise<IPurchaseReceipt> {
  return await postServer<IPurchaseReceipt, typeof payload>(`/purchaseReceipts/createPurchaseReceipt/${eventId}`, payload, signal);
}

export async function uploadPurchaseReceiptFile(receiptId: string, file: File, signal?: AbortSignal): Promise<{ imageId: string }> {
  return await postFileServer<{ imageId: string }>(`/purchaseReceipts/uploadFile/${receiptId}`, file, signal);
}

export async function deletePurchaseReceipt(receiptId: string, eventId: string, signal?: AbortSignal): Promise<IPurchaseReceipt> {
  return await deleteServer<IPurchaseReceipt>(`/purchaseReceipts/deletePurchaseReceipt/${receiptId}/${eventId}`, signal);
}

export async function assignMembersToReceipt(
  payload: { receipts: IPurchaseByEvent[] },
  signal?: AbortSignal
): Promise<IPurchaseAssignmentResponse> {
  return await putServer<IPurchaseAssignmentResponse, typeof payload>('/purchaseReceipts/assignMembersToReceipt', payload, signal);
}
