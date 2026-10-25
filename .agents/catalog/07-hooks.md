# Catálogo de Servicios Reactivos y Utilidades — Frontend Angular 19

En Angular 19, los equivalentes a "custom hooks" son los **servicios inyectables basados en Signals**, facades y utilidades reactivas.

---

## 1. `AuthFacade` (Estado Centralizado de Sesión)

- **Ruta**: `src/app/core/services/auth.facade.ts`
- **Signals Expuestos**:
  - `currentUser`: `Signal<User | null>`
  - `isAuthenticated`: `Signal<boolean>`
  - `userPermissions`: `Signal<string[]>`
  - `isSocialLoading`: `Signal<boolean>`
- **Cuándo usarlo**: En cualquier componente o navbar que requiera saber el usuario logueado o validar permisos.

---

## 2. `ActionHandler` (Utilidad para Observables y Feedback)

- **Ruta**: `src/app/shared/utils/action-handler.ts`
- **Propósito**: Ejecuta un `Observable<Result<T>>` suscribiéndose con `take(1)` y despachando automáticamente toasts de éxito o error.
- **Cuándo usarlo**: En los métodos `onSubmit()` de formularios o acciones de botones que llaman a servicios.

---

## 3. `PermissionService` (Evaluación de Permisos)

- **Ruta**: `src/app/core/services/permission.service.ts`
- **Propósito**: Verifica si el usuario actual posee un permiso específico (`hasPermission(slug: string)`). Considera bypass para roles administrativos.

---

## 4. Pipes Reutilizables

### `TruncatePipe` (`truncate`)
- **Ruta**: `src/app/shared/pipes/truncate.pipe.ts`
- **Propósito**: Trunca texto largo agregando `...` de forma pura (`pure: true`).
- **Ejemplo**:
  ```html
  <p>{{ novel.description | truncate: 120 }}</p>
  ```
