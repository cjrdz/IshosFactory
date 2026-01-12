// Toast notification store

import { atom } from 'nanostores';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toasts = atom<Toast[]>([]);

let toastIdCounter = 0;

function generateToastId(): string {
  return `toast_${Date.now()}_${toastIdCounter++}`;
}

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
): void {
  const toast: Toast = {
    id: generateToastId(),
    message,
    type,
    duration,
  };
  
  const currentToasts = toasts.get();
  toasts.set([...currentToasts, toast]);
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast.id);
    }, duration);
  }
}

export function removeToast(id: string): void {
  const currentToasts = toasts.get();
  toasts.set(currentToasts.filter((toast) => toast.id !== id));
}

export function clearToasts(): void {
  toasts.set([]);
}


