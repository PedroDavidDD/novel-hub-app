import { Component, Input, Inject, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_ERRORS } from '../../../core/tokens/error-messages.token';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-group">
      <label *ngIf="label">{{ label }} <span *ngIf="isRequired" class="text-red-500">*</span></label>
      
      <input 
        [type]="type" 
        [value]="value"
        (input)="onChange($any($event.target).value)"
        (blur)="onTouched()"
        [class.error]="control?.invalid && control?.touched"
        class="input-base"
      />

      <div *ngIf="control?.invalid && control?.touched" class="error-msg">
        {{ getErrorMessage() }}
      </div>
    </div>
  `
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  
  value: any = '';
  onChange = (val: any) => {};
  onTouched = () => {};

  constructor(
    @Self() @Optional() public control: NgControl,
    @Inject(FORM_ERRORS) private globalErrors: Record<string, string>
  ) {
    if (this.control) this.control.valueAccessor = this;
  }

  get isRequired() {
    // Truco para detectar si tiene validador 'required'
    if (!this.control?.control?.validator) return false;
    const validator = this.control.control.validator({} as any);
    return validator && validator['required'];
  }

  getErrorMessage(): string {
    if (!this.control?.errors) return '';
    const firstKey = Object.keys(this.control.errors)[0];
    // Retorna mensaje global o uno default
    return this.globalErrors[firstKey] || `Error: ${firstKey}`;
  }

  // Implementación CVA
  writeValue(obj: any): void { this.value = obj; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}