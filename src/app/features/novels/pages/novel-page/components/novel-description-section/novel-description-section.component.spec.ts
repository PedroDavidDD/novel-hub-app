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
    tags: ['#Magic', '#Adventure'],
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

  it('should compute mainCategories (status 1) and secondaryCategories (status 2), omitting status 0', () => {
    const novelWithCategories: INovel = {
      ...mockNovel,
      categories: [
        { name: 'Magia', status: 1 },
        { name: 'Aventura', status: 1 },
        { name: 'Misterio', status: 2 },
        { name: 'Oculto', status: 0 },
      ],
    };
    fixture.componentRef.setInput('novel', novelWithCategories);
    fixture.detectChanges();

    expect(component.mainCategories()).toEqual([
      { name: 'Magia', status: 1 },
      { name: 'Aventura', status: 1 },
    ]);
    expect(component.secondaryCategories()).toEqual([
      { name: 'Misterio', status: 2 },
    ]);
  });

  it('should fallback to genres as status 1 and tags as status 2 when categories is empty', () => {
    fixture.componentRef.setInput('novel', mockNovel);
    fixture.detectChanges();

    expect(component.mainCategories()).toEqual([
      { name: 'Fantasy', status: 1 },
      { name: 'Action', status: 1 },
    ]);
    expect(component.secondaryCategories()).toEqual([
      { name: '#Magic', status: 2 },
      { name: '#Adventure', status: 2 },
    ]);
  });
});
