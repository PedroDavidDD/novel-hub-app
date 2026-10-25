# Catálogo de Modales y Notificaciones — Frontend Angular 19

Este catálogo documenta los componentes y servicios para ventanas modales y alertas.

---

## 1. `ModalAlertService` (Alertas y Confirmaciones Dinámicas)

- **Ruta**: `src/app/shared/services/modal-alert.service.ts`
- **Propósito**: Permite disparar modales de alerta o confirmación mediante una API simple basada en `Promise<boolean>` usando `createComponent()` sin requerir instanciar templates en el HTML.

### Métodos y Tipos
```typescript
export type ModalType = 'success' | 'warning' | 'error' | 'alert' | 'confirm' | 'info';

export interface ModalAlertOptions {
  type: ModalType;
  message: string;
  title?: string;
  isStatic?: boolean;
  hideButtons?: boolean;
  duration?: number;
  onConfirm?: () => Promise<any>;
}
```

### Ejemplo Real de Uso
```typescript
const modalAlertService = inject(ModalAlertService);

// Diálogo de confirmación asíncrono
const confirmed = await modalAlertService.alert({
  type: 'confirm',
  title: '¿Eliminar capítulo?',
  message: 'Esta acción no se puede deshacer.',
});

if (confirmed) {
  // Proceder con la eliminación
}
```

---

## 2. `ModalComponent` (`app-modal`)

- **Ruta**: `src/app/shared/components/modal/modal.component.ts`
- **Propósito**: Modal contenedor estructural para incrustar contenido arbitrario (por ejemplo, el buscador de la barra de navegación).
- **Inputs**:
  - `title`: string
  - `show`: boolean

---

## 3. `ToastService` (Notificaciones Flotantes)

- **Ruta**: `src/app/shared/services/toast.service.ts`
- **Propósito**: Muestra notificaciones efímeras automáticas (con auto-cierre configurable).
- **Ejemplo**:
  ```typescript
  const toastService = inject(ToastService);

  toastService.showSuccess('Operación exitosa');
  toastService.showError('No se pudo guardar el registro');
  toastService.showInfo('Nueva actualización disponible');
  toastService.showWarning('La sesión expirará pronto');
  ```
