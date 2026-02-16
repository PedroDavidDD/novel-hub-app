import { ChangeDetectionStrategy, Component, Inject, input, Optional, Self, signal, computed } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_ERRORS } from '../../../core/tokens/error-messages.token';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-group">
      @if (label()) {
        <label>{{ label() }} @if (isRequired()) { <span class="text-red-500">*</span> }</label>
      }
      
      <input 
        [type]="type()" 
        [value]="value()"
        (input)="handleInput($event)"
        (blur)="onTouched()"
        [class.error]="isInvalid()"
        class="input-base"
      />

      @if (isInvalid()) {
        <div class="error-msg">
          {{ getErrorMessage() }}
        </div>
      }
    </div>
  `
})
export class CustomInputComponent implements ControlValueAccessor {
  // Signals para Inputs
  label = input<string>('');
  type = input<string>('text');
  
  // Internal State
  value = signal<any>('');
  
  // CVA Callbacks
  onChange = (val: any) => {};
  onTouched = () => {};

  // Computed Properties for UI
  isRequired = computed(() => {
    const validator = this.control?.control?.validator?.({} as any);
    return !!(validator && validator['required']);
  });

  isInvalid = computed(() => {
    return !!(this.control?.invalid && this.control?.touched);
  });

  constructor(
    @Self() @Optional() public control: NgControl,
    @Inject(FORM_ERRORS) private globalErrors: Record<string, string>
  ) {
    if (this.control) this.control.valueAccessor = this;
  }

  getErrorMessage(): string {
    const errors = this.control?.errors;
    if (!errors) return '';
    const firstKey = Object.keys(errors)[0];
    return this.globalErrors[firstKey] || `Error: ${firstKey}`;
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  // Implementation of ControlValueAccessor
  writeValue(obj: any): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementar si es necesario
  }
}
