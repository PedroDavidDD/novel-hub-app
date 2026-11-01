import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagSecondaryComponent } from './tag-secondary.component';

describe('TagSecondaryComponent', () => {
  let component: TagSecondaryComponent;
  let fixture: ComponentFixture<TagSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagSecondaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagSecondaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('vcLabel', 'Drama');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should prepend # when vcLabel does not start with #', () => {
    expect(component.formattedLabel()).toBe('#Drama');
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.trim()).toBe('#Drama');
  });

  it('should not duplicate # when vcLabel already starts with #', () => {
    fixture.componentRef.setInput('vcLabel', '#Misterio');
    fixture.detectChanges();

    expect(component.formattedLabel()).toBe('#Misterio');
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.trim()).toBe('#Misterio');
  });

  it('should emit onClick when clicked', () => {
    let emitted = '';
    component.onClick.subscribe((val) => {
      emitted = val;
    });

    const span = fixture.nativeElement.querySelector('span');
    span.click();

    expect(emitted).toBe('Drama');
  });
});
