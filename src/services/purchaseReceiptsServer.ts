import { IPurchaseReceipt } from '@models/purchases';
import { getFileServer, getServer } from './httpServer';

export async function getPurchaseReceipts(event: string | undefined, signal?: AbortSignal): Promise<IPurchaseReceipt[]> {
  const url = `/purchaseReceipts/getPurchaseReceiptsByEvent/${event}`;
  return await getServer(url, signal);
}

export async function getImage(idImage: string | undefined, signal?: AbortSignal): Promise<Blob> {
  const url = `/images/getImage/${idImage}`;
  return await getFileServer(url, signal);
}
