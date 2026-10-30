import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environments } from '../../../../environments/environments';

export interface IReleaseSchedule {
  days: string[];
  time: string;
}

export interface IChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  content?: string;
  views: number;
  isPremium: boolean;
  publishedAt?: string;
}

export interface INovel {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  image: string;
  genres: string[];
  tags: string[];
  language: string;
  status: string;
  popularity: number;
  rating: number;
  views: number;
  opinionsCount: number;
  freeChaptersCount: number;
  premiumChaptersCount: number;
  releaseSchedule?: IReleaseSchedule;
  chapters?: number | string[];
  releaseDate?: string;
}

@Injectable({ providedIn: 'root' })
export class NovelsService {
  private readonly baseUrl: string = environments.baseUrl;
  private readonly http = inject(HttpClient);

  private readonly initialNovels: INovel[] = [
    {
      id: '1',
      title: 'I Became an Extra Who Takes In Defeated Heroines',
      slug: 'ibaewtidh',
      author: '와즈샌',
      description: 'I became the flirty extra in a love comedy.\n\nTo prevent a disastrous future in the sequel, I tried to take in the defeated heroines beforehand...\n\nAs soon as my transmigration began, the original love comedy ended.',
      image: '/assets/images/novel-ibaewtidh.jpg',
      genres: ['Fantasy', 'Action', 'Harem', 'Adventure'],
      tags: ['#Fallen Nobility', '#Game Elements', '#Misunderstood Protagonist', '#Male Protagonist', '#System', '#Dungeon', '#Weak to Strong', '#Secret Society', '#Elves', '#Beastkin'],
      language: 'Korean',
      status: 'Ongoing',
      popularity: 1540,
      rating: 4.8,
      views: 435949,
      opinionsCount: 1200,
      freeChaptersCount: 154,
      premiumChaptersCount: 0,
      chapters: 154,
      releaseSchedule: { days: ['Sun', 'Mon', 'Wed', 'Fri', 'Sat'], time: '11:45 a. m.' },
      releaseDate: '2024-01-10'
    },
    {
      id: '2',
      title: "I Don't Need A Guillotine For My Revolution!",
      slug: 'guillotine-revolution',
      author: 'Robespierre Fan',
      description: 'I died on the wrong side of history, a nobleman executed by revolutionaries.\n\nSent back in time, I now know the truth: the only way to survive the coming rebellion is to make sure it succeeds.\n\nTo save my own head, I must join the very cause I once condemned.',
      image: '/assets/images/novel-guillotine.jpg',
      genres: ['Action', 'Fantasy', 'Romance'],
      tags: ['#Conspiracies', '#Romance', '#Male Protagonist', '#Regression', '#Knights'],
      language: 'English',
      status: 'Ongoing',
      popularity: 1900,
      rating: 4.9,
      views: 190680,
      opinionsCount: 850,
      freeChaptersCount: 258,
      premiumChaptersCount: 0,
      chapters: 258,
      releaseSchedule: { days: ['Sun x3', 'Mon x3', 'Tue x3', 'Wed x3', 'Thu x3', 'Fri x3', 'Sat x3'], time: '3:15 p. m.' },
      releaseDate: '2023-08-15'
    },
    {
      id: '3',
      title: "Es 'Sugerencia', no 'Hipnosis'",
      slug: 'es-sugerencia-no-hipnosis',
      author: '연습용더미',
      description: 'Me transmigraron como villano basura con solo una habilidad de sugerencia.\n\nNo es tan bueno como la hipnosis, pero esto debería ser bastante decente.',
      image: '/assets/images/novel-suggestion.jpg',
      genres: ['Vida moderna', 'Vida escolar'],
      tags: ['#Hipnosis', '#Academia', '#Protagonista masculino'],
      language: 'Korean',
      status: 'Ongoing',
      popularity: 3740,
      rating: 4.9,
      views: 1336729,
      opinionsCount: 1336729,
      freeChaptersCount: 354,
      premiumChaptersCount: 20,
      chapters: 374,
      releaseSchedule: { days: ['Sun', 'Mon', 'Mar', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], time: '10:00 a. m.' },
      releaseDate: '2023-05-20'
    }
  ];

  private readonly novelsSignal = signal<INovel[]>(this.initialNovels);
  readonly novels = this.novelsSignal.asReadonly();

  getAllNovels(): Observable<INovel[]> {
    return this.http.get<any>(`${this.baseUrl}/novels`).pipe(
      map(res => {
        const rawList = res?.data || res;
        if (Array.isArray(rawList) && rawList.length > 0) {
          const mapped = rawList.map(item => this.mapToDomain(item));
          this.novelsSignal.set(mapped);
          return mapped;
        }
        return this.initialNovels;
      }),
      catchError(() => of(this.novelsSignal()))
    );
  }

  getNovelById(slugOrTitle: string): Observable<INovel | undefined> {
    const clean = slugOrTitle?.trim() || '';
    return this.http.get<any>(`${this.baseUrl}/novels/${encodeURIComponent(clean)}`).pipe(
      map(res => {
        const raw = res?.data || res;
        if (raw && (raw.title || raw.slug)) {
          return this.mapToDomain(raw);
        }
        return this.findLocal(clean);
      }),
      catchError(() => of(this.findLocal(clean)))
    );
  }

  getChaptersByNovel(novelIdOrSlug: string): Observable<IChapterItem[]> {
    const clean = novelIdOrSlug?.trim() || '';
    return this.http.get<any>(`${this.baseUrl}/chapters/novel/${encodeURIComponent(clean)}`).pipe(
      map(res => {
        const rawList = res?.data || res;
        if (Array.isArray(rawList) && rawList.length > 0) {
          return rawList.map((ch: any) => ({
            id: ch._id || ch.id || '',
            chapterNumber: ch.chapterNumber ?? ch.props?.chapterNumber ?? 0,
            title: ch.title ?? ch.props?.title ?? `Chapter ${ch.chapterNumber}`,
            content: ch.content ?? ch.props?.content ?? '',
            views: ch.views ?? ch.props?.views ?? 0,
            isPremium: ch.isPremium ?? ch.props?.isPremium ?? false,
            publishedAt: ch.publishedAt ?? ch.props?.publishedAt,
          }));
        }
        return this.getFallbackChapters(clean);
      }),
      catchError(() => of(this.getFallbackChapters(clean)))
    );
  }

  getRandomNovel(): Observable<INovel | undefined> {
    const list = this.novelsSignal();
    if (list.length === 0) return of(undefined);
    const randomIndex = Math.floor(Math.random() * list.length);
    return of(list[randomIndex]);
  }

  private findLocal(identifier: string): INovel | undefined {
    const lower = identifier.toLowerCase();
    return this.novelsSignal().find(
      n => n.id === identifier || n.slug.toLowerCase() === lower || n.title.toLowerCase() === lower
    );
  }

  private normalizeImage(img?: string): string {
    if (!img) return '/assets/images/novel1.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  }

  private mapToDomain(raw: any): INovel {
    const props = raw.props || raw;
    return {
      id: raw.id || raw._id || '',
      title: props.title || 'Untitled',
      slug: props.slug || (props.title ? props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ''),
      author: props.author || 'Unknown',
      description: props.description || '',
      image: props.image || '/assets/images/novel-ibaewtidh.jpg',
      genres: Array.isArray(props.genre) ? props.genre : (Array.isArray(props.genres) ? props.genres : []),
      tags: Array.isArray(props.tags) ? props.tags : [],
      language: props.sourceLanguage || props.language || 'English',
      status: props.status || 'Ongoing',
      popularity: props.popularity || 0,
      rating: props.rating || 0,
      views: props.views || 0,
      opinionsCount: props.opinionsCount || 0,
      freeChaptersCount: props.freeChaptersCount || 0,
      premiumChaptersCount: props.premiumChaptersCount || 0,
      releaseSchedule: props.releaseSchedule || { days: ['Mon', 'Wed', 'Fri'], time: '10:00 a. m.' },
      chapters: Array.isArray(props.chapters) ? props.chapters.length : (props.chapters || 0),
      releaseDate: props.createdAt || props.releaseDate,
    };
  }

  private getFallbackChapters(slug: string): IChapterItem[] {
    const target = this.findLocal(slug);
    if (!target) return [];

    return [
      { id: 'ch-0', chapterNumber: 0, title: 'Ch. 0: Prologue', views: 16483, isPremium: false },
      { id: 'ch-1', chapterNumber: 1, title: 'Ch. 1: Ending the Original Work', views: 11240, isPremium: false },
      { id: 'ch-2', chapterNumber: 2, title: "Ch. 2: The Defeated Heroines' Aftermath is Cold", views: 6947, isPremium: false },
      { id: 'ch-3', chapterNumber: 3, title: 'Ch. 3: A Slightly Changed Impression', views: 4916, isPremium: false },
      { id: 'ch-4', chapterNumber: 4, title: 'Ch. 4: The First Journey After Graduation', views: 4577, isPremium: false },
      { id: 'ch-5', chapterNumber: 5, title: 'Ch. 5: Mysterious Low-level Dungeon (Or Not)', views: 4101, isPremium: false },
      { id: 'ch-6', chapterNumber: 6, title: 'Ch. 6: Dungeon Successfully Completed', views: 3857, isPremium: false },
      { id: 'ch-7', chapterNumber: 7, title: 'Ch. 7: To Carrot Duchy', views: 3723, isPremium: false },
      { id: 'ch-8', chapterNumber: 8, title: 'Ch. 8: Sword of Light', views: 3195, isPremium: false },
      { id: 'ch-9', chapterNumber: 9, title: 'Ch. 9: Second Defeated Heroine', views: 3383, isPremium: false },
      { id: 'ch-10', chapterNumber: 10, title: 'Ch. 10: Life Is a Series of Choices', views: 3508, isPremium: false },
    ];
  }
}
