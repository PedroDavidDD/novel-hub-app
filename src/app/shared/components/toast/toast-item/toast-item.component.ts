import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../services/toast.service';

@Component({
    selector: 'app-toast-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast-item.component.html',
    styleUrls: ['./toast-item.component.css']
})
export class ToastItemComponent implements OnInit, OnDestroy {
    @Input({ required: true }) toast!: Toast;
    @Input() variant: 'solid' | 'blur' = 'solid';
    @Output() close = new EventEmitter<string>();

    public remainingTime: number = 0;
    private intervalId: any;

    ngOnInit() {
        this.remainingTime = Math.ceil((this.toast.duration || 3000) / 1000);

        // Only run counter if it's the blur variant or if we decide to show it generally
        if (this.variant === 'blur' && this.remainingTime > 0) {
            this.intervalId = setInterval(() => {
                this.remainingTime -= 1;
                if (this.remainingTime <= 0) {
                    this.remainingTime = 0;
                    this.clearTimer();
                }
            }, 1000);
        }
    }

    ngOnDestroy() {
        this.clearTimer();
    }

    private clearTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    onClose() {
        this.close.emit(this.toast.id);
    }
}
