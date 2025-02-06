import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../../environments/environments';

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
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
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
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
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
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 900,
        chapters: 45,
        releaseDate: '2021-08-15',
        rating: 4.3
      },
      {
        id: '4',
        title: 'Manual Novel 4',
        description: 'A manually added sci-fi story.',
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
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
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 700,
        chapters: 45,
        releaseDate: '2021-08-15',
        rating: 4.3
      },
      {
        id: '6',
        title: 'Manual Novel 6',
        description: 'A manually added sci-fi story.',
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 1800,
        chapters: 45,
        releaseDate: '2024-08-15',
        rating: 4.3
      },
      {
        id: '7',
        title: 'Manual Novel 7',
        description: 'A manually added sci-fi story.',
        image: 'https://pbs.twimg.com/media/Gi5NAk5a4AEN-nD?format=jpg&name=small',
        genres: ['Action', 'Romance','Drama','Fantasia','Adventure'],
        language: 'Chinese',
        status: 'Hiatus',
        popularity: 800,
        chapters: 45,
        releaseDate: '2025-08-15',
        rating: 4.3
      }
    ];

  // Estado global de las novelas
  private novelsSubject = new BehaviorSubject<INovel[]>( this.initialNovels );

  constructor(private http: HttpClient) {}

  // getNovels(): Observable<INovel[]> {
  //   return this.http.get<INovel[]>(`${this.baseUrl}/novels`).pipe(
  //     // Si la llamada HTTP es exitosa, actualizamos el subject con los datos obtenidos
  //     map(novels => novels ?? this.initialNovels), // Si `novels` es `null` o `undefined`, usamos las novelas de prueba
  //     catchError(error => {
  //       console.error('Error al cargar novelas:', error);
  //       return of(this.initialNovels); // Si hay error, retornamos novelas de prueba
  //     })
  //   );
  // }
  getNovels(): Observable<INovel[]> {
    // this.http.get<Novel[]>(`${this.baseUrl}/novels`)
    return this.novelsSubject.asObservable();
  }

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