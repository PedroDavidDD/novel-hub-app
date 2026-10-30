import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardShineDirective } from './card-shine.directive';

@Component({
  standalone: true,
  imports: [CardShineDirective],
  template: `
    <div class="test-card" appCardShine>
      <img src="assets/images/novel1.jpg" alt="Test" />
    </div>
  `,
})
class TestHostComponent {}

describe('CardShineDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CardShineDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('debe inicializar el elemento shine y overlay dentro del host', () => {
    const cardEl = fixture.nativeElement.querySelector('.test-card');
    const shineEl = cardEl.querySelector('.app-card-shine-glare');
    const gradientEl = cardEl.querySelector('.app-card-gradient-overlay');

    expect(shineEl).toBeTruthy();
    expect(gradientEl).toBeTruthy();
    expect(cardEl.style.overflow).toBe('hidden');
  });

  it('debe aplicar zoom en la imagen y opacidad en gradient al hacer mouseenter', () => {
    const cardEl = fixture.nativeElement.querySelector('.test-card');
    const imgEl = cardEl.querySelector('img');
    const gradientEl = cardEl.querySelector('.app-card-gradient-overlay');

    cardEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(imgEl.style.transform).toBe('scale(1.05)');
    expect(gradientEl.style.opacity).toBe('1');
  });

  it('debe restaurar zoom y ocultar overlay al hacer mouseleave', () => {
    const cardEl = fixture.nativeElement.querySelector('.test-card');
    const imgEl = cardEl.querySelector('img');
    const gradientEl = cardEl.querySelector('.app-card-gradient-overlay');

    cardEl.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    cardEl.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(imgEl.style.transform).toBe('scale(1)');
    expect(gradientEl.style.opacity).toBe('0');
  });
});
