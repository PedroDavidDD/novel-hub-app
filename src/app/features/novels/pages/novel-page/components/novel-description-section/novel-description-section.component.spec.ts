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
    tags: [
      { name: 'Fantasy', status: 1 },
      { name: 'Action', status: 1 },
      { name: 'Magic', status: 2 },
      { name: 'Adventure', status: 2 },
    ],
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

  it('should compute mainTags (status 1) and secondaryTags (status 2), omitting status 0', () => {
    const novelWithTags: INovel = {
      ...mockNovel,
      tags: [
        { name: 'Magia', status: 1 },
        { name: 'Aventura', status: 1 },
        { name: 'Misterio', status: 2 },
        { name: 'Oculto', status: 0 },
      ],
    };
    fixture.componentRef.setInput('novel', novelWithTags);
    fixture.detectChanges();

    expect(component.mainTags()).toEqual([
      { name: 'Magia', status: 1 },
      { name: 'Aventura', status: 1 },
    ]);
    expect(component.secondaryTags()).toEqual([
      { name: 'Misterio', status: 2 },
    ]);
  });

  it('should compute tags from mockNovel correctly', () => {
    fixture.componentRef.setInput('novel', mockNovel);
    fixture.detectChanges();

    expect(component.mainTags()).toEqual([
      { name: 'Fantasy', status: 1 },
      { name: 'Action', status: 1 },
    ]);
    expect(component.secondaryTags()).toEqual([
      { name: 'Magic', status: 2 },
      { name: 'Adventure', status: 2 },
    ]);
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
