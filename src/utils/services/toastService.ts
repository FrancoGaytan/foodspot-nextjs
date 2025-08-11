export enum ToastType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export type ToastData = { message: string; type: ToastType };

let cb: ((toast: ToastData) => void) | null = null;

export function subscribeToToast(listener: (toast: ToastData) => void) {
  cb = listener;
}

export function showToast(message: string, type: ToastType = ToastType.INFO) {
  if (cb) cb({ message, type });
}

export function getIconName(type: string): string {
  switch (type) {
    case 'success':
      return 'check_circle';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'info';
  }
}
