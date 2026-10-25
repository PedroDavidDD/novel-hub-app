# Modelo Funcional y Seguridad — Frontend Angular 19

## 1. Gestión de Estado y Autenticación: `AuthFacade`

El estado de sesión del usuario se gestiona mediante `AuthFacade` (`src/app/core/services/auth.facade.ts`), el cual encapsula signals para:
- `currentUser`: Signal con los datos del usuario logueado.
- `isAuthenticated`: Computed signal derivado (`!!currentUser()`).
- `userPermissions`: Computed signal con los permisos string del usuario.
- `isSocialLoading`: Signal que refleja si se está procesando un login social.

---

## 2. Guards de Enrutamiento

### `AuthGuard` (`src/app/core/guards/auth.guard.ts`)
- Impide el acceso a rutas protegidas (ej. perfil, ajustes) si el usuario no tiene una sesión activa válida.
- Redirige a `/#/auth/login`.

### `NotAuthenticatedGuard` (`src/app/core/guards/notAuthenticated.guard.ts`)
- Impide que usuarios ya autenticados vuelvan a ver formularios de login o registro.
- Redirige al inicio `/#/`.

### `PermissionGuard` (`src/app/core/guards/permission.guard.ts`)
- Evalúa si el usuario cuenta con el permiso requerido en el campo `data.permission` de la ruta Angular.

---

## 3. Directiva de Permisos en Plantillas: `HasPermissionDirective`

- **Ruta**: `src/app/shared/directives/has-permission.directive.ts`
- **Uso**: Oculta o muestra elementos del DOM condicionalmente según los permisos del usuario.
- **Ejemplo**:
  ```html
  <button *appHasPermission="'novels.create'" (click)="openCreateModal()">
    Crear Novela
  </button>
  ```

---

## 4. Interceptor HTTP: `AuthInterceptor`

- **Ruta**: `src/app/core/interceptors/auth.interceptor.ts`
- **Comportamiento**:
  - Clona la petición saliente y adjunta la cabecera `Authorization: Bearer <token>` si existe un token en almacenamiento.
  - No altera peticiones públicas o de OAuth no requeridas.
