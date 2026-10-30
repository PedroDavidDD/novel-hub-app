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
- **Propósito**: Modal contenedor estructural para incrustar contenido arbitrario (formularios, ajustes, buscador).
- **Inputs**:
  - `title`: string (título del modal)
  - `show`: boolean (estado visible)
  - `isStatic`: boolean (por defecto `true`: el backdrop o overlay oscuro no cierra el modal para evitar pérdidas accidentales de datos)
  - `showCloseButton`: boolean (por defecto `true`: botón 'X' en la cabecera)
  - `maxWidth`: string (por defecto `'max-w-lg'`)
- **Outputs**:
  - `close`: EventEmitter<void>
  - `onClose`: EventEmitter<void>

### 📐 Reglas Estándar de Maquetación de Botones en Modales
1. **Backdrop Estático**: Todo modal tiene backdrop estático por defecto (`isStatic: true`), prohibiendo su cierre al hacer clic sobre el overlay negro. Solo se cierra mediante la 'X' superior o el botón "Cancelar".
2. **Posición del Botón Cancelar**: El botón "Cancelar" (`CANCEL` / `Cancelar`) siempre se coloca a la **derecha** del resto de botones de acción primaria (`[GUARDAR] [CANCELAR]`).
3. **Centrado Horizontal por Defecto**: La botonera de acciones del modal debe estar alineada al **centro** (`flex items-center justify-center gap-4`) por defecto, a menos que un diseño específico justifique otra alineación.

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
