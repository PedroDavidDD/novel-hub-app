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

  it('should emit onClick event when clicked', () => {
    let emitted = '';
    component.onClick.subscribe((val) => {
      emitted = val;
    });

    const span = fixture.nativeElement.querySelector('span');
    span.click();

    expect(emitted).toBe('Lunes');
  });
});
