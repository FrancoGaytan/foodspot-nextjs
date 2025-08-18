import { IPurchaseReceipt } from '@models/purchases';
import { getServer } from './httpServer';

export async function getPurchaseReceipts(event: string | undefined, signal?: AbortSignal): Promise<IPurchaseReceipt[]> {
  const url = `/purchaseReceipts/getPurchaseReceiptsByEvent/${event}`;
  return await getServer(url, signal);
}
