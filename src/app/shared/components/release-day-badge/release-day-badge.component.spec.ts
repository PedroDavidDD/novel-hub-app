import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReleaseDayBadgeComponent } from './release-day-badge.component';

describe('ReleaseDayBadgeComponent', () => {
  let component: ReleaseDayBadgeComponent;
  let fixture: ComponentFixture<ReleaseDayBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseDayBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseDayBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('vcLabel', 'Lunes');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided vcLabel', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent?.trim()).toBe('Lunes');
  });

  it('should have 10px rounded border radius class and primary styling', () => {
    const classes = component.badgeClasses();
    expect(classes).toContain('rounded-[10px]');
    expect(classes).toContain('border-2 border-transparent');
    expect(classes).toContain('hover:border-[var(--color-primary)]');
  });

  it('should apply disabled styling and aria-disabled when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const classes = component.badgeClasses();
    expect(classes).toContain('cursor-not-allowed');
    expect(classes).toContain('opacity-40');
    expect(component.isDisabled()).toBeTrue();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.getAttribute('aria-disabled')).toBe('true');
  });

  it('should not emit onClick when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicked = false;
    component.onClick.subscribe(() => {
      clicked = true;
    });

    const span = fixture.nativeElement.querySelector('span');
    span.click();

    expect(clicked).toBeFalse();
  });

  it('should emit onClick event when enabled and clicked', () => {
    let emitted = '';
    component.onClick.subscribe((val) => {
      emitted = val;
    });

    const span = fixture.nativeElement.querySelector('span');
    span.click();

    expect(emitted).toBe('Lunes');
  });
});
