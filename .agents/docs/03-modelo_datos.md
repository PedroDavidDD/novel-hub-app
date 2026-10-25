# Modelo de Datos y Adaptadores — Frontend Angular 19

Este archivo documenta los modelos de datos en el frontend y cómo se conectan con los contratos del backend.

> **Nota**: El frontend no posee base de datos directa. Consume el API REST del backend NestJS (`http://localhost:3000`) y transforma los DTOs en interfaces de dominio locales.

---

## 1. Patrón Adapter (DTO → Domain Model)

Para evitar acoplar los componentes de la interfaz a los cambios de esquema del backend, los datos entrantes pasan por clases o funciones **Adapter**:

- **Ejemplo**: `AuthAdapter` (`src/app/features/auth/adapters/auth.adapter.ts`).
- Transforma `ApiResponse<UserBackendDto>` en la entidad `User` utilizada por la aplicación.

---

## 2. Modelos Principales de Dominio

### A. Usuario (`src/app/core/models/user.model.ts`)
```typescript
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  raceId: number | null;
  isActive: boolean;
}
```

### B. Novela (`src/app/features/novels/interfaces/novel.interface.ts` y `models/`)
```typescript
export interface INovel {
  id: string;
  title: string;
  description: string;
  image: string;
  associatedNames: string[];
  genre: string[];
  tags: string[];
  sourceLanguage: string;
  status: string;
  popularity: number;
  rating: number;
  chapters: number;
  releaseDate: string;
}
```

### C. Patrón Resultado (`src/app/core/models/result.model.ts`)
```typescript
export class Result<T> {
  private constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string,
  ) {}

  static ok<U>(data: U): Result<U> {
    return new Result(true, data);
  }

  static fail<U>(error: string): Result<U> {
    return new Result(false, undefined, error);
  }

  isSuccess(): boolean {
    return this.success;
  }
}
```
