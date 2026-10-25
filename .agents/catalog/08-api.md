# Catálogo de Integración API y Servicios HTTP — Frontend Angular 19

Este catálogo documenta cómo el frontend consume los endpoints del backend NestJS.

---

## 1. Configuración de API Base

- **URL Base de Desarrollo**: `http://localhost:3000`
- **Cabeceras de Autorización**: Gestionadas de manera transparente por `AuthInterceptor`:
  ```
  Authorization: Bearer <jwt_token>
  ```

---

## 2. Servicios de Dominio

### A. `NovelsService`
- **Ruta**: `src/app/features/novels/services/novels.service.ts`
- **Propósito**: Consulta y almacena en un signal `novels = signal<INovel[]>([])` la lista de novelas cargadas desde el backend.

### B. `AuthService`
- **Ruta**: `src/app/features/auth/services/auth.service.ts`
- **Endpoints consumidos**:
  - `POST /auth/login`
  - `POST /auth/register`
  - `POST /auth/refresh`
  - `GET /auth/profile`

### C. Proveedores Sociales (`social/`)
- **Ruta**: `src/app/features/auth/services/social/`
- **Servicios**: `GoogleAuthService`, `FacebookAuthService`, `OauthConfigService`.

---

## 3. Manejo de Errores HTTP y Pattern Result

Todos los servicios capturan los errores con RxJS `catchError` y retornan instancias de `Result<T>`:

```typescript
login(credentials: LoginDto): Observable<Result<User>> {
  return this.http.post<ApiResponse<UserDto>>(`${this.apiUrl}/auth/login`, credentials).pipe(
    map(response => Result.ok(this.adapter.toDomain(response.data))),
    catchError(err => of(Result.fail(err.error?.msg || 'Error al iniciar sesión')))
  );
}
```
Los componentes **NUNCA reciben excepciones HTTP crudas**.
