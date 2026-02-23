import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environments } from '../../../environments/environments';
import { ApiResponse } from '../../features/auth/interfaces/auth.interface';

export interface Role {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  isProtected: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environments.baseUrl;

  getRoleByName(roleName: string): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(
      `${this.baseUrl}/roles?criterio=${roleName}`
    ).pipe(
      catchError(() => of({ statusCode: 0 as const, data: [], msg: 'Error loading role' }))
    );
  }
}
