import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
  Self,
  computed,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_ERRORS } from '../../../core/tokens/error-messages.token';
import { INPUT_LIMITS } from '../../../core/constants/input-limits.constant';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-group flex flex-col w-full">
      @if (label()) {
        <label class="block text-xs font-semibold text-[var(--color-description)] uppercase mb-1">
          {{ label() }}
          @if (isRequired()) {
            <span class="text-red-500 font-bold">*</span>
          }
        </label>
      }

      <div class="relative w-full">
        @if (isTextarea()) {
          <textarea
            [value]="value()"
            [placeholder]="placeholder()"
            [rows]="rows()"
            [attr.maxlength]="maxLength() > 0 ? maxLength() : null"
            [disabled]="isDisabled()"
            [readonly]="readonly()"
            (input)="handleInput($event)"
            (blur)="onTouched()"
            [class.border-red-500]="isInvalid()"
            [class.pb-7]="showCounter() && maxLength() > 0"
            [class.pr-16]="showCounter() && maxLength() > 0"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-section)] text-[var(--color-black)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-sm outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          ></textarea>

          @if (showCounter() && maxLength() > 0) {
            <div
              data-testid="char-counter"
              class="absolute right-2.5 bottom-2.5 px-1.5 py-0.5 rounded-md text-[11px] font-mono leading-none select-none pointer-events-none transition-colors backdrop-blur-[2px] bg-[var(--color-primary)]/20 text-[var(--color-black)] border border-[var(--color-primary)]/30"
              [class.text-red-500]="isAtLimit()"
              [class.border-red-500]="isAtLimit()"
            >
              {{ currentLength() }} / {{ maxLength() }}
            </div>
          }
        } @else {
          <input
            [type]="type()"
            [value]="value()"
            [placeholder]="placeholder()"
            [attr.maxlength]="maxLength() > 0 ? maxLength() : null"
            [disabled]="isDisabled()"
            [readonly]="readonly()"
            (input)="handleInput($event)"
            (blur)="onTouched()"
            [class.border-red-500]="isInvalid()"
            [class.pr-20]="showCounter() && maxLength() > 0"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-section)] text-[var(--color-black)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />

          @if (showCounter() && maxLength() > 0) {
            <div
              data-testid="char-counter"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md text-[11px] font-mono leading-none select-none pointer-events-none transition-colors backdrop-blur-[2px] bg-[var(--color-primary)]/20 text-[var(--color-black)] border border-[var(--color-primary)]/30"
              [class.text-red-500]="isAtLimit()"
              [class.border-red-500]="isAtLimit()"
            >
              {{ currentLength() }} / {{ maxLength() }}
            </div>
          }
        }
      </div>

      @if (isInvalid()) {
        <div class="text-xs text-red-500 mt-1">
          {{ getErrorMessage() }}
        </div>
      }
    </div>
  `,
})
export class CustomInputComponent implements ControlValueAccessor {
  // Signals para Inputs configurables
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  maxLength = input<number>(INPUT_LIMITS.TEXT_STANDARD);
  showCounter = input<boolean>(true);
  rows = input<number>(3);
  readonly = input<boolean>(false);

  // Estado interno
  value = signal<any>('');
  isDisabled = signal<boolean>(false);

  // CVA Callbacks
  onChange = (val: any) => {};
  onTouched = () => {};

  // Computed Properties
  isTextarea = computed(() => this.type() === 'textarea');

  currentLength = computed(() => {
    const val = this.value();
    if (val === null || val === undefined) return 0;
    return String(val).length;
  });

  isAtLimit = computed(() => {
    const max = this.maxLength();
    return max > 0 && this.currentLength() >= max;
  });

  isRequired = computed(() => {
    const validator = this.control?.control?.validator?.({} as any);
    return !!(validator && validator['required']);
  });

  isInvalid = computed(() => {
    return !!(this.control?.invalid && this.control?.touched);
  });

  constructor(
    @Self() @Optional() public control: NgControl,
    @Optional() @Inject(FORM_ERRORS) private globalErrors: Record<string, string> | null,
  ) {
    if (this.control) this.control.valueAccessor = this;
  }

  getErrorMessage(): string {
    const errors = this.control?.errors;
    if (!errors) return '';
    const firstKey = Object.keys(errors)[0];
    return (this.globalErrors && this.globalErrors[firstKey]) || `Campo inválido (${firstKey})`;
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  // Implementation of ControlValueAccessor
  writeValue(obj: any): void {
    this.value.set(obj ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
