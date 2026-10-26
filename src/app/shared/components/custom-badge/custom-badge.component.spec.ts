import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomBadgeComponent } from './custom-badge.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CustomBadgeComponent],
  template: `
    <app-badge
      [vcLabel]="genreName"
      [vcVariant]="badgeVariant"
      (onClick)="onSelected($event)"
    />
  `
})
class TestHostComponent {
  genreName = 'Fantasy';
  badgeVariant: 'primary' | 'secondary' | 'neutral' = 'primary';
  selectedGenre = '';

  onSelected(genre: string): void {
    this.selectedGenre = genre;
  }
}

describe('CustomBadgeComponent (Dumb)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CustomBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe renderizar la etiqueta vcLabel correctamente', () => {
    const badgeElement = fixture.nativeElement.querySelector('span');
    expect(badgeElement.textContent.trim()).toBe('Fantasy');
  });

  it('debe emitir onClick con el nombre del género al hacer clic', () => {
    const badgeElement = fixture.nativeElement.querySelector('span');
    badgeElement.click();
    expect(host.selectedGenre).toBe('Fantasy');
  });

  it('debe contener las clases de la variante primary con borde en hover', () => {
    const badgeElement = fixture.nativeElement.querySelector('span');
    expect(badgeElement.className).toContain('hover:border-[var(--color-primary)]');
  });
});
