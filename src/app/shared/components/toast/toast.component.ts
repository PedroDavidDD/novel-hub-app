import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { ToastItemComponent } from './toast-item/toast-item.component';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, ToastItemComponent],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css'],
    animations: [
        trigger('slideIn', [
            state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
            transition(':enter', [
                animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastComponent {
    public toastService = inject(ToastService);

    // Legacy input to control variant, mapped to 'variant' string in template
    @Input() isBlur: boolean = false;
}
