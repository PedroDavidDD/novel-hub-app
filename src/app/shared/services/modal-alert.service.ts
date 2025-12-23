import { Injectable, ApplicationRef, EnvironmentInjector, createComponent, ComponentRef, inject } from '@angular/core';
import { ModalAlertComponent, ModalType } from '../components/modal-alert/modal-alert.component';

export interface ModalAlertOptions {
    type: ModalType;
    message: string;
    title?: string;
    isStatic?: boolean;
    hideButtons?: boolean;
    duration?: number;
    onConfirm?: () => Promise<any>;
}

@Injectable({
    providedIn: 'root'
})
export class ModalAlertService {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);

    /**
     * Shows a modal alert and returns a promise that resolves when closed.
     * Returns true if confirmed/accepted, false if cancelled/closed.
     */
    alert(options: ModalAlertOptions): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            // Create the component
            const componentRef: ComponentRef<ModalAlertComponent> = createComponent(ModalAlertComponent, {
                environmentInjector: this.injector
            });

            // Set inputs
            componentRef.instance.type = options.type;
            componentRef.instance.message = options.message;
            componentRef.instance.title = options.title || '';
            componentRef.instance.isStatic = options.isStatic || false;
            componentRef.instance.hideButtons = options.hideButtons || false;
            componentRef.instance.duration = options.duration || 0;
            componentRef.instance.onConfirm = options.onConfirm;

            // Attach to the view
            this.appRef.attachView(componentRef.hostView);
            const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);

            // Listen for close event
            const sub = componentRef.instance.close.subscribe((result: boolean) => {
                resolve(result);
                destroy();
            });

            // Cleanup function
            function destroy() {
                sub.unsubscribe();
                // We typically wait a tiny bit for animation out if handled internally by component logic, 
                // but the component emits close AFTER animation out logic finishes usually.
                // In our component logic, we emit close after animation. So we can safely destroy.
                componentRef.destroy();
                // Ensure removed from DOM just in case destroy doesn't do it (it strictly should if attached properly)
                if (document.body.contains(domElem)) {
                    document.body.removeChild(domElem);
                }
            }
        });
    }
}
