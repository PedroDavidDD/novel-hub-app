import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomButtonComponent } from './custom-button.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CustomButtonComponent],
  template: `
    <app-button
      [text]="buttonText"
      [variant]="buttonVariant"
      [loading]="isLoading"
      [disabled]="isDisabled"
      (onClick)="onClicked()"
    />
  `
})
class TestHostComponent {
  buttonText = 'Click Me';
  buttonVariant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary';
  isLoading = false;
  isDisabled = false;
  clicked = false;

  onClicked(): void {
    this.clicked = true;
  }
}

describe('CustomButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CustomButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe renderizar el texto provisto', () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Click Me');
  });

  it('debe emitir onClick al hacer clic', () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    expect(host.clicked).toBeTrue();
  });

  it('no debe emitir onClick cuando disabled es true', () => {
    host.isDisabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    expect(host.clicked).toBeFalse();
  });

  it('debe mostrar spinner y deshabilitar cuando loading es true', () => {
    host.isLoading = true;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
    expect(buttonElement.disabled).toBeTrue();
  });
});
