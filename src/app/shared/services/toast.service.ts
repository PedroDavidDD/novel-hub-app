import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: string;
    title?: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    public toasts = signal<Toast[]>([]);

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000, title?: string): void {
        const id = crypto.randomUUID();
        const newToast: Toast = { id, message, type, duration, title };

        this.toasts.update(current => [...current, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    showSuccess(message: string, duration?: number, title?: string): void {
        this.show(message, 'success', duration, title);
    }

    showError(message: string, duration?: number, title?: string): void {
        this.show(message, 'error', duration, title);
    }

    showInfo(message: string, duration?: number, title?: string): void {
        this.show(message, 'info', duration, title);
    }

    showWarning(message: string, duration?: number, title?: string): void {
        this.show(message, 'warning', duration, title);
    }

    remove(id: string): void {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
