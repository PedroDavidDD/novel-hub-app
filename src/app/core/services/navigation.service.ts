import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environments } from '../../../environments/environments';
import { NavigationItem } from '../models/navigation.model';
import { NavigationAdapter } from '../adapters/navigation.adapter';
import { ApiResponse } from '../../features/auth/interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environments.baseUrl;

  getNavigationTree(): Observable<NavigationItem[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/navigation`).pipe(
      map(response => {
        if (response && response.statusCode === 1 && Array.isArray(response.data)) {
          return NavigationAdapter.toDomainList(response.data);
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching navigation tree:', error);
        return of([]);
      })
    );
  }
}
