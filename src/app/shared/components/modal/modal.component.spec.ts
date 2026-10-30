import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal
      [title]="modalTitle"
      [show]="isModalShown"
      [isStatic]="isModalStatic"
      (onClose)="handleClose()"
    >
      <div class="test-content">Contenido de prueba proyectado</div>
    </app-modal>
  `
})
class TestHostComponent {
  modalTitle = 'Mi Modal Reutilizable';
  isModalShown = false;
  isModalStatic = false;
  closed = false;

  handleClose(): void {
    this.closed = true;
    this.isModalShown = false;
  }
}

describe('ModalComponent (Dumb Component)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no debe renderizar nada cuando show es false', () => {
    const backdrop = fixture.nativeElement.querySelector('.app-modal-backdrop');
    expect(backdrop).toBeNull();
  });

  it('debe renderizar el título y proyectar contenido cuando show es true', () => {
    host.isModalShown = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.app-modal-backdrop');
    expect(backdrop).not.toBeNull();

    const titleEl = fixture.nativeElement.querySelector('h2');
    expect(titleEl.textContent.trim()).toBe('Mi Modal Reutilizable');

    const contentEl = fixture.nativeElement.querySelector('.test-content');
    expect(contentEl.textContent.trim()).toBe('Contenido de prueba proyectado');
  });

  it('debe emitir cierre al hacer clic en el botón X', () => {
    host.isModalShown = true;
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Cerrar modal"]');
    closeBtn.click();
    fixture.detectChanges();

    expect(host.closed).toBe(true);
  });

  it('debe cerrar al hacer clic en el backdrop si no es estático', () => {
    host.isModalShown = true;
    host.isModalStatic = false;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.app-modal-backdrop');
    backdrop.click();
    fixture.detectChanges();

    expect(host.closed).toBe(true);
  });

  it('no debe cerrar al hacer clic en el backdrop si isStatic es true', () => {
    host.isModalShown = true;
    host.isModalStatic = true;
    host.closed = false;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.app-modal-backdrop');
    backdrop.click();
    fixture.detectChanges();

    expect(host.closed).toBe(false);
  });

  it('debe tener isStatic en true por defecto', () => {
    const compFixture = TestBed.createComponent(ModalComponent);
    const comp = compFixture.componentInstance;
    expect(comp.isStatic()).toBe(true);
  });
});
