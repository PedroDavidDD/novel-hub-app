# Catálogo de Subida de Archivos — Frontend Angular 19

Este catálogo documenta el componente estándar para carga de archivos en el frontend.

---

## 1. `FileUploaderComponent` (`app-file-uploader`)

- **Ruta**: `src/app/shared/components/file-uploader/file-uploader.component.ts`
- **Propósito**: Componente Drag & Drop para carga de archivos con soporte para archivos únicos o múltiples, previsualización de imágenes y barra de progreso.

---

## 2. Parámetros de Configuración (`@Input`)

| Propiedad | Tipo | Default | Descripción |
|---|---|---|---|
| `multiple` | `boolean` | `false` | Permite seleccionar varios archivos simultáneos. |
| `validTypes` | `string[]` | `['image/png', 'application/pdf']` | MIME types autorizados. |
| `maxSizeMB` | `number` | `5` | Tamaño máximo en Megabytes por archivo. |
| `uploadFn` | `(file: File) => Observable<number>` | `undefined` | Función opcional para carga automática con progreso (0 a 100). |
| `deleteFn` | `(file: File) => Observable<boolean>` | `undefined` | Función para invocar al remover un archivo subido. |

---

## 3. Eventos de Salida (`@Output`)

| Evento | Tipo | Descripción |
|---|---|---|
| `filesChanged` | `EventEmitter<FileItem[]>` | Emite la lista actual de archivos seleccionados. |
| `onView` | `EventEmitter<FileItem>` | Emite cuando el usuario presiona el botón "Ver". |

---

## 4. Ejemplo Real de Uso

```html
<app-file-uploader
  [multiple]="false"
  [validTypes]="['image/jpeg', 'image/png', 'image/webp']"
  [maxSizeMB]="2"
  (filesChanged)="handleCoverUpload($event)">
</app-file-uploader>
```

---

## 5. Reglas de Uso

- **Archivos de Imagen**: Siempre limitar `validTypes` a formatos web (`image/jpeg`, `image/png`, `image/webp`).
- **No reinventar el Drop Zone**: Usar siempre `app-file-uploader` en lugar de crear `<input type="file">` manuales.
