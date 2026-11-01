import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovelDescriptionSectionComponent } from './novel-description-section.component';
import { INovel } from '../../../../services/novels.service';
import { resolveNovelStatusUI } from '../../constants/novel-page.constants';

describe('NovelDescriptionSectionComponent', () => {
  let component: NovelDescriptionSectionComponent;
  let fixture: ComponentFixture<NovelDescriptionSectionComponent>;

  const mockNovel: INovel = {
    id: 'test-1',
    title: 'Test Novel Title',
    slug: 'test-novel',
    author: 'Test Author',
    description: 'This is a test description that can be expanded or collapsed.',
    image: '/assets/images/novel1.jpg',
    genres: ['Fantasy', 'Action'],
    tags: ['Magic', 'Adventure'],
    language: 'Spanish',
    status: 'Ongoing',
    popularity: 100,
    rating: 4.5,
    views: 12000,
    opinionsCount: 45,
    freeChaptersCount: 3,
    premiumChaptersCount: 2,
    releaseSchedule: { days: ['Mon', 'Fri'], time: '10:00 a. m.' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelDescriptionSectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NovelDescriptionSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('novel', mockNovel);
    fixture.componentRef.setInput('novelStatusConfig', resolveNovelStatusUI('Ongoing'));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isDescriptionExpanded signal when toggleDescription is called', () => {
    expect(component.isDescriptionExpanded()).toBeFalse();
    component.toggleDescription();
    expect(component.isDescriptionExpanded()).toBeTrue();
    component.toggleDescription();
    expect(component.isDescriptionExpanded()).toBeFalse();
  });

  it('should emit genreClick output when onGenreClick is called', () => {
    let clickedGenre = '';
    component.genreClick.subscribe((genre) => {
      clickedGenre = genre;
    });

    component.onGenreClick('Fantasy');
    expect(clickedGenre).toBe('Fantasy');
  });

  it('should emit tagClick output when onTagClick is called', () => {
    let clickedTag = '';
    component.tagClick.subscribe((tag) => {
      clickedTag = tag;
    });

    component.onTagClick('Magic');
    expect(clickedTag).toBe('Magic');
  });

  it('should compute genres and tags correctly', () => {
    expect(component.genres()).toEqual(['Fantasy', 'Action']);
    expect(component.tags()).toEqual(['Magic', 'Adventure']);
  });

  it('should compute weeklySchedule with 7 days and mark days as active or disabled', () => {
    fixture.componentRef.setInput('novel', mockNovel);
    fixture.detectChanges();

    const schedule = component.weeklySchedule();
    expect(schedule.length).toBe(7);

    const mon = schedule.find(d => d.key === 'lun');
    const tue = schedule.find(d => d.key === 'mar');
    const fri = schedule.find(d => d.key === 'vie');

    expect(mon?.isActive).toBeTrue();
    expect(tue?.isActive).toBeFalse();
    expect(fri?.isActive).toBeTrue();
  });
});
