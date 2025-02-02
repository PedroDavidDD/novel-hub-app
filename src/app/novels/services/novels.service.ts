import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environments';

export interface INovel {
  id: string;
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
    private initialNovels: INovel[] = [
      {
        id: '1',
        title: 'Manual Novel 1',
        description: 'A manually added adventure novel.',
        image: 'https://static.wikia.nocookie.net/ftblbv/images/d/da/Dowd_Campbell.png/revision/latest?cb=20230330071943',
        genres: ['Sci-Fi', 'Action'],
        language: 'Chinese',
        status: 'Ongoing',
        popularity: 1000,
        chapters: 50,
        releaseDate: '2023-01-01',
        rating: 4.5
      },
      {
        id: '2',
        title: 'Manual Novel 2',
        description: 'A manually added romantic novel.',
        image: 'https://static.wikia.nocookie.net/ftblbv/images/5/55/Eleanor_Official.png/revision/latest?cb=20241102181705',
        genres: ['Romance', 'Drama'],
        language: 'Korean',
        status: 'Completed',
        popularity: 1200,
        chapters: 60,
        releaseDate: '2022-05-20',
        rating: 4.7
      },
      {
        id: '3',
        title: 'Manual Novel 3',
        description: 'A manually added sci-fi story.',
        image: 'https://static.wikia.nocookie.net/ftblbv/images/e/ed/Illiya_Official.png/revision/latest?cb=20241102182837',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 800,
        chapters: 45,
        releaseDate: '2021-08-15',
        rating: 4.3
      },
      {
        id: '4',
        title: 'Manual Novel 4',
        description: 'A manually added sci-fi story.',
        image: 'https://static.wikia.nocookie.net/ftblbv/images/1/1c/Yuria_Official_1.png/revision/latest?cb=20241102182018',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 800,
        chapters: 45,
        releaseDate: '2021-08-15',
        rating: 4.3
      },
      {
        id: '5',
        title: 'Manual Novel 5',
        description: 'A manually added sci-fi story.',
        image: 'https://static.wikia.nocookie.net/ftblbv/images/d/dc/Cover.jpg/revision/latest?cb=20240701021349',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 800,
        chapters: 45,
        releaseDate: '2021-08-15',
        rating: 4.3
      }
    ];

  // Estado global de las novelas
  private novelsSubject = new BehaviorSubject<INovel[]>( this.initialNovels );

  constructor(private http: HttpClient) {}

  getNovels(): Observable<INovel[]> {
    // Realiza la solicitud HTTP y maneja el error
    this.http.get<INovel[]>(`${this.baseUrl}/novels`).pipe(
      catchError(error => {
        console.error('Error al cargar novelas:', error);
        return of([]);
      })
    )
    // .subscribe(novels => {
    //   this.novelsSubject.next(novels);
    // });

    return this.novelsSubject.asObservable(); 
  }
  // getNovels(): Observable<INovel[]> {
  //   // this.http.get<Novel[]>(`${this.baseUrl}/novels`)
  //   return this.novelsSubject.asObservable();
  // }

  getNovelById(id: string): Observable<INovel | undefined> {
    return this.http.get<INovel>(`${this.baseUrl}/novels/${id}`)
      .pipe(
        catchError(() => of(undefined))
      );
  }

  addNovel(novel: INovel): Observable<INovel> {
    return this.http.post<INovel>(`${this.baseUrl}/novels`, novel)
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

  updateNovel(novel: INovel): Observable<INovel> {
    return this.http.patch<INovel>(`${this.baseUrl}/novels/${novel.title}`, novel)
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