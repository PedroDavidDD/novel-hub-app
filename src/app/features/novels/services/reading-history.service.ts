import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environments } from '../../../../environments/environments';

export interface IReadingProgress {
  id: string;
  userId: string;
  novelId: string;
  lastChapterNumber: number;
  readChapters: number[];
  lastReadAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  msg: string;
}

@Injectable({ providedIn: 'root' })
export class ReadingHistoryService {
  private readonly baseUrl: string = environments.baseUrl;
  private readonly http = inject(HttpClient);

  getProgressByNovelId(novelId: string): Observable<IReadingProgress | null> {
    if (!novelId) return of(null);
    return this.http.get<ApiResponse<IReadingProgress | null>>(
      `${this.baseUrl}/reading-history/novel/${encodeURIComponent(novelId)}`
    ).pipe(
      map(res => res?.statusCode === 1 ? res.data : null),
      catchError(() => of(null))
    );
  }

  saveProgress(novelId: string, chapterNumber: number): Observable<IReadingProgress | null> {
    if (!novelId || typeof chapterNumber !== 'number') return of(null);
    return this.http.post<ApiResponse<IReadingProgress>>(
      `${this.baseUrl}/reading-history`,
      { novelId, chapterNumber }
    ).pipe(
      map(res => res?.statusCode === 1 ? res.data : null),
      catchError(() => of(null))
    );
  }
}
