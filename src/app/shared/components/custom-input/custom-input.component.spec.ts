import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './custom-input.component';
import { INPUT_LIMITS } from '../../../core/constants/input-limits.constant';

@Component({
  standalone: true,
  imports: [CustomInputComponent, ReactiveFormsModule],
  template: `
    <app-input
      [label]="label()"
      [type]="type()"
      [maxLength]="maxLength()"
      [showCounter]="showCounter()"
      [formControl]="control"
    />
  `,
})
class TestHostComponent {
  label = signal<string>('Test Input');
  type = signal<string>('text');
  maxLength = signal<number>(INPUT_LIMITS.TEXT_STANDARD);
  showCounter = signal<boolean>(true);
  control = new FormControl('');
}

describe('CustomInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CustomInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe renderizar el contador inicial "0 / 250" por defecto', () => {
    const counterEl = fixture.nativeElement.querySelector('[data-testid="char-counter"]');
    expect(counterEl).toBeTruthy();
    expect(counterEl.textContent.trim()).toBe('0 / 250');
  });

  it('debe actualizar el contador al ingresar texto', () => {
    host.control.setValue('NovelHub');
    fixture.detectChanges();

    const counterEl = fixture.nativeElement.querySelector('[data-testid="char-counter"]');
    expect(counterEl.textContent.trim()).toBe('8 / 250');
  });

  it('debe respetar un maxLength personalizado de INPUT_LIMITS', () => {
    host.maxLength.set(INPUT_LIMITS.TEXT_SHORT); // 50
    fixture.detectChanges();

    const counterEl = fixture.nativeElement.querySelector('[data-testid="char-counter"]');
    expect(counterEl.textContent.trim()).toBe('0 / 50');
  });

  it('debe ocultar el contador si showCounter es false', () => {
    host.showCounter.set(false);
    fixture.detectChanges();

    const counterEl = fixture.nativeElement.querySelector('[data-testid="char-counter"]');
    expect(counterEl).toBeNull();
  });

  it('debe renderizar elemento textarea cuando type="textarea" con contador en bottom', () => {
    host.type.set('textarea');
    host.maxLength.set(INPUT_LIMITS.TEXT_AREA); // 1000
    host.control.setValue('Sinopsis larga');
    fixture.detectChanges();

    const textareaEl = fixture.nativeElement.querySelector('textarea');
    const inputEl = fixture.nativeElement.querySelector('input');
    const counterEl = fixture.nativeElement.querySelector('[data-testid="char-counter"]');

    expect(textareaEl).toBeTruthy();
    expect(inputEl).toBeNull();
    expect(counterEl).toBeTruthy();
    expect(counterEl.textContent.trim()).toBe('14 / 1000');
    expect(counterEl.classList).toContain('bottom-2.5');
  });

  it('debe aplicar estilos de límite cuando se alcanza el maxLength', () => {
    host.maxLength.set(5);
    host.control.setValue('12345');
    fixture.detectChanges();

    const counterEl = fixture.nativeElement.querySelector('[data-testid="char-counter"]');
    expect(counterEl.textContent.trim()).toBe('5 / 5');
    expect(counterEl.classList).toContain('text-red-500');
  });
});
