import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environments';

export interface Novel {
  title: string;
  description: string;
  image: string;
  genres: string[];
  language: string;
  status: string;
  popularity: number;
  chapters: number;
  releaseDate: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class NovelsService {
  private baseUrl: string = environments.baseUrl;

    // Datos manuales de prueba
    private initialNovels: Novel[] = [
      {
        title: 'Manual Novel 1',
        description: 'A manually added adventure novel.',
        image: 'assets/images/novel1.jpg',
        genres: ['Action', 'Adventure'],
        language: 'Chinese',
        status: 'Ongoing',
        popularity: 1000,
        chapters: 50,
        releaseDate: '2023-01-01',
        rating: 4.5
      },
      {
        title: 'Manual Novel 2',
        description: 'A manually added romantic novel.',
        image: 'assets/images/novel2.jpg',
        genres: ['Romance', 'Drama'],
        language: 'Korean',
        status: 'Completed',
        popularity: 1200,
        chapters: 60,
        releaseDate: '2022-05-20',
        rating: 4.7
      },
      {
        title: 'Manual Novel 3',
        description: 'A manually added sci-fi story.',
        image: 'assets/images/novel3.jpg',
        genres: ['Sci-Fi', 'Action'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 800,
        chapters: 45,
        releaseDate: '2021-08-15',
        rating: 4.3
      }
    ];

  // Estado global de las novelas
  private novelsSubject = new BehaviorSubject<Novel[]>( this.initialNovels );
  novels$ = this.novelsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadNovels(): void {
    this.http.get<Novel[]>(`${this.baseUrl}/novels`)
      .pipe(
        catchError(error => {
          console.error('Error al cargar novelas:', error);
          return of([]);
        })
      )
      .subscribe(novels => this.novelsSubject.next(novels));
  }

  getNovelById(id: string): Observable<Novel | undefined> {
    return this.http.get<Novel>(`${this.baseUrl}/novels/${id}`)
      .pipe(
        catchError(() => of(undefined))
      );
  }

  addNovel(novel: Novel): Observable<Novel> {
    return this.http.post<Novel>(`${this.baseUrl}/novels`, novel)
      .pipe(
        map(newNovel => {
          const currentNovels = this.novelsSubject.value;
          this.novelsSubject.next([...currentNovels, newNovel]);
          return newNovel;
        }),
        catchError(error => {
          console.error('Error al agregar novela:', error);
          return of(novel);
        })
      );
  }

  updateNovel(novel: Novel): Observable<Novel> {
    return this.http.patch<Novel>(`${this.baseUrl}/novels/${novel.title}`, novel)
      .pipe(
        map(updatedNovel => {
          const updatedNovels = this.novelsSubject.value.map(n => 
            n.title === novel.title ? updatedNovel : n
          );
          this.novelsSubject.next(updatedNovels);
          return updatedNovel;
        }),
        catchError(error => {
          console.error('Error al actualizar novela:', error);
          return of(novel);
        })
      );
  }

  deleteNovel(title: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/novels/${title}`)
      .pipe(
        map(() => {
          const filteredNovels = this.novelsSubject.value.filter(n => n.title !== title);
          this.novelsSubject.next(filteredNovels);
          return true;
        }),
        catchError(error => {
          console.error('Error al eliminar novela:', error);
          return of(false);
        })
      );
  }
}