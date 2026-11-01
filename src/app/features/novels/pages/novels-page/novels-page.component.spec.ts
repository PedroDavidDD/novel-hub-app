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
      tags: [
        { name: 'Fantasía Épica', status: 1 },
        { name: 'Aventura', status: 1 },
        { name: 'Magia', status: 2 },
      ],
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
      tags: [
        { name: 'Ciencia Ficción', status: 1 },
        { name: 'Aventura', status: 1 },
        { name: 'Inactivo', status: 0 },
      ],
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

  it('should compute availableTags dynamically from loaded novels excluding status 0', () => {
    const tags = component.availableTags();
    expect(tags).toContain('Aventura');
    expect(tags).toContain('Fantasía Épica');
    expect(tags).toContain('Magia');
    expect(tags).toContain('Ciencia Ficción');
    expect(tags).not.toContain('Inactivo');
  });

  it('should auto-select tag from queryParams via syncFiltersFromQueryParams', () => {
    queryParamsSubject.next({ tag: 'Aventura' });
    fixture.detectChanges();

    expect(component.selectedTags()).toEqual(['Aventura']);
    expect(component.filteredNovels().length).toBe(2);
  });

  it('should handle comma-separated tags in queryParams', () => {
    queryParamsSubject.next({ tag: 'Magia, Fantasía Épica' });
    fixture.detectChanges();

    expect(component.selectedTags()).toEqual(['Magia', 'Fantasía Épica']);
    expect(component.filteredNovels().length).toBe(1);
    expect(component.filteredNovels()[0].slug).toBe('endv');
  });

  it('should reset selectedTags when queryParams has no tag', () => {
    queryParamsSubject.next({ tag: 'Aventura' });
    expect(component.selectedTags()).toEqual(['Aventura']);

    queryParamsSubject.next({});
    expect(component.selectedTags()).toEqual([]);
    expect(component.filteredNovels().length).toBe(2);
  });

  it('should update selectedTags and navigate with queryParams on tag checkbox change', () => {
    const mockEvent = {
      target: { checked: true } as HTMLInputElement,
    } as unknown as Event;

    component.onTagChange('Magia', mockEvent);

    expect(component.selectedTags()).toContain('Magia');
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { tag: 'Magia' },
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
