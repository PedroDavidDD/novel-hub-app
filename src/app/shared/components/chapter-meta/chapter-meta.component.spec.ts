import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChapterMetaComponent } from './chapter-meta.component';

describe('ChapterMetaComponent', () => {
  let component: ChapterMetaComponent;
  let fixture: ComponentFixture<ChapterMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterMetaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display dash fallback when date is undefined', () => {
    expect(component.formattedDate()).toBe('-');
  });

  it('should format date properly in dd/mm/aaaa format', () => {
    fixture.componentRef.setInput('vcDate', new Date(2026, 9, 25));
    fixture.detectChanges();
    expect(component.formattedDate()).toBe('25/10/2026');
  });

  it('should accept views input and render correctly', () => {
    fixture.componentRef.setInput('vcViews', 15420);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('15,420');
  });
});
