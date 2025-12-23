import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalType = 'success' | 'warning' | 'error' | 'alert' | 'confirm' | 'info';

@Component({
    selector: 'app-modal-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal-alert.component.html',
    styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent implements OnInit {
    @Input() type: ModalType = 'success';
    @Input() message: string = '';
    @Input() title: string = '';
    @Input() isStatic: boolean = false;
    @Input() loading: boolean = false;
    @Input() hideButtons: boolean = false;
    @Input() duration: number = 0; // ms

    // onConfirm can be a promise-returning function for async operations
    @Input() onConfirm?: () => Promise<any>;

    // Emits the result: true (confirm), false (cancel/close)
    @Output() close = new EventEmitter<boolean>();

    public animateIn = false;

    get iconClass(): string {
        switch (this.type) {
            case 'success': return 'fa-solid fa-circle-check text-success';
            case 'warning': return 'fa-solid fa-triangle-exclamation text-warning';
            case 'error': return 'fa-solid fa-circle-xmark text-danger';
            case 'info':
            case 'alert': return 'fa-solid fa-circle-info text-info';
            case 'confirm': return 'fa-solid fa-circle-question text-primary';
            default: return 'fa-solid fa-circle-info text-info';
        }
    }

    // Icons colors aligned with global styles
    get iconColorClass(): string {
        switch (this.type) {
            case 'success': return 'text-success';
            case 'warning': return 'text-warning';
            case 'error': return 'text-error';
            case 'info':
            case 'alert':
                return 'text-info';
            case 'confirm': return 'text-primary';
            default: return '';
        }
    }

    ngOnInit() {
        // Trigger animation on init
        setTimeout(() => this.animateIn = true, 10);

        // Auto-close if duration is set
        if (this.duration > 0) {
            setTimeout(() => {
                this.closeModal(true);
            }, this.duration);
        }
    }

    onBackdropClick(event: MouseEvent) {
        if (!this.isStatic && !this.loading) {
            this.closeModal(false);
        }
    }

    async confirm() {
        if (this.loading) return;

        if (this.type === 'confirm' && this.onConfirm) {
            this.loading = true;
            try {
                await this.onConfirm();
                this.loading = false;
                this.closeModal(true);
            } catch (error) {
                this.loading = false;
                // Error handling could be expanded here
            }
        } else {
            // For non-confirm types (success, error), the "Entendido" button effectively means "Close/True" or just close.
            // Usually 'Entendido' just closes.
            this.closeModal(true);
        }
    }

    cancel() {
        this.closeModal(false);
    }

    closeModal(result: boolean) {
        if (!this.loading) {
            this.animateIn = false;
            // Wait for animation out
            setTimeout(() => {
                this.close.emit(result);
            }, 300);
        }
    }
}
