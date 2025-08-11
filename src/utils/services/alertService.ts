import { ToastType } from '@utils/services/toastService';

type AlertData = { text: string; type: ToastType };

let handler: ((data: AlertData) => void) | null = null;

export function subscribeToAlerts(cb: (data: AlertData) => void) {
  handler = cb;
}

export function showAlert(text: string, type: ToastType) {
  if (handler) {
    handler({ text, type });
  }
}
