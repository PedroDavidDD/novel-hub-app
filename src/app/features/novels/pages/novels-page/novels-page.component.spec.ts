import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { signal } from '@angular/core';
import { NovelsPageComponent } from './novels-page.component';
import { INovel, NovelsService } from '../../services/novels.service';

describe('NovelsPageComponent', () => {
  let component: NovelsPageComponent;
  let fixture: ComponentFixture<NovelsPageComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let queryParamsSubject: BehaviorSubject<Record<string, any>>;

  const mockNovels: INovel[] = [
    {
      id: '1',
      title: 'El Nombre del Viento',
      slug: 'endv',
      author: 'Patrick Rothfuss',
      description: 'Una posada rural...',
      image: '/novel1.jpg',
      language: 'Spanish',
      status: 'Ongoing',
      popularity: 100,
      rating: 4.8,
      views: 38240,
      opinionsCount: 20,
      freeChaptersCount: 3,
      premiumChaptersCount: 2,
      genres: ['Fantasía Épica', 'Aventura'],
      tags: ['Magia', 'Universidad'],
    },
    {
      id: '2',
      title: 'Dune',
      slug: 'dune',
      author: 'Frank Herbert',
      description: 'En el planeta Arrakis...',
      image: '/novel2.jpg',
      language: 'English',
      status: 'Completed',
      popularity: 80,
      rating: 4.9,
      views: 15000,
      opinionsCount: 10,
      freeChaptersCount: 5,
      premiumChaptersCount: 0,
      genres: ['Ciencia Ficción', 'Aventura'],
      tags: ['Espacio', 'Política'],
    },
  ];

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    queryParamsSubject = new BehaviorSubject<Record<string, any>>({});

    const mockNovelsService = {
      novels: signal<INovel[]>(mockNovels),
      getAllNovels: jasmine.createSpy('getAllNovels').and.returnValue(of(mockNovels)),
    };

    await TestBed.configureTestingModule({
      imports: [NovelsPageComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
        { provide: NovelsService, useValue: mockNovelsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and call getAllNovels', () => {
    expect(component).toBeTruthy();
    expect(component.filteredNovels().length).toBe(2);
  });

  it('should compute availableGenres and availableTags dynamically from loaded novels', () => {
    const genres = component.availableGenres();
    expect(genres).toContain('Aventura');
    expect(genres).toContain('Fantasía Épica');
    expect(genres).toContain('Ciencia Ficción');

    const tags = component.availableTags();
    expect(tags).toContain('Magia');
    expect(tags).toContain('Universidad');
    expect(tags).toContain('Espacio');
    expect(tags).toContain('Política');
  });

  it('should auto-select genre and tag from queryParams via syncFiltersFromQueryParams', () => {
    queryParamsSubject.next({ genre: 'Aventura', tag: 'Magia' });
    fixture.detectChanges();

    expect(component.selectedGenres()).toEqual(['Aventura']);
    expect(component.selectedTags()).toEqual(['Magia']);
    expect(component.filteredNovels().length).toBe(1);
    expect(component.filteredNovels()[0].slug).toBe('endv');
  });

  it('should handle comma-separated filters in queryParams', () => {
    queryParamsSubject.next({ genre: 'Aventura, Ciencia Ficción' });
    fixture.detectChanges();

    expect(component.selectedGenres()).toEqual(['Aventura', 'Ciencia Ficción']);
    expect(component.filteredNovels().length).toBe(2);
  });

  it('should toggle genre selection and update queryParams', () => {
    component.toggleGenre('Ciencia Ficción');

    expect(component.selectedGenres()).toContain('Ciencia Ficción');
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { genre: 'Ciencia Ficción', tag: null },
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should toggle tag selection and update queryParams', () => {
    component.toggleTag('Espacio');

    expect(component.selectedTags()).toContain('Espacio');
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { genre: null, tag: 'Espacio' },
        queryParamsHandling: 'merge',
      })
    );
  });

  it('should filter by language and status accurately', () => {
    component.filterByLanguage('English');
    expect(component.filteredNovels().length).toBe(1);
    expect(component.filteredNovels()[0].slug).toBe('dune');

    component.filterByLanguage('Any');
    component.filterByStatus('Ongoing');
    expect(component.filteredNovels().length).toBe(1);
    expect(component.filteredNovels()[0].slug).toBe('endv');
  });
});
