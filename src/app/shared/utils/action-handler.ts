import { Observable, Observer, take } from 'rxjs';
import { ToastService } from '../services/toast.service';

export interface ActionConfig<T> {
    action: Observable<T>;
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    successTitle?: string;
    successDuration?: number;
    errorMessage?: string; // Optional custom message, otherwise err.message or default
    errorTitle?: string;
    errorDuration?: number;
}

export class ActionHandler {
    constructor(private toastService: ToastService) { }

  execute<T>(config: ActionConfig<T>): void {
        const observer: Observer<T> = {
            next: (result: T) => {
                if (result && typeof result === 'object' && 'success' in result) {
                    const resultObj = result as { success: boolean; error?: string };

                    if (!resultObj.success && resultObj.error) {
                        const message = config.errorMessage || resultObj.error || 'An unexpected error occurred';
                        this.toastService.showError(message, config.errorDuration || 3000, config.errorTitle || 'Error');
                        if (config.onError) {
                            config.onError(result);
                        }
                        return;
                    }
                }

                if (config.successMessage) {
                    this.toastService.showSuccess(config.successMessage, config.successDuration || 3000, config.successTitle || 'Success');
                }
                if (config.onSuccess) {
                    config.onSuccess(result);
                }
            },
            error: (err: any) => {
                const message = config.errorMessage || err?.message || 'An unexpected error occurred';
                this.toastService.showError(message, config.errorDuration || 3000, config.errorTitle || 'Error');
                if (config.onError) {
                    config.onError(err);
                }
            },
            complete: () => {
                // Optional complete handling
            }
        };

        config.action.pipe(take(1)).subscribe(observer);
    }
}
