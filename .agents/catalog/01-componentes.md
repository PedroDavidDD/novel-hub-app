# Catálogo de Componentes UI Reutilizables — Frontend Angular 19

Este catálogo lista los componentes UI reales encontrados en `src/app/shared/components/` y `src/app/core/components/`.

---

## 1. Componentes de Entrada y Formulario

### `CustomInputComponent` (`app-input`)
- **Ruta**: `src/app/shared/components/custom-input/custom-input.component.ts`
- **Propósito**: Input tipado reutilizable que implementa `ControlValueAccessor` (CVA), compatible directamente con `formControlName`.
- **Inputs**:
  - `label`: `input<string>('')`
  - `type`: `input<string>('text')`
- **Integración de Errores**:
  - Se vincula automáticamente con el token `FORM_ERRORS` para mostrar mensajes en español si el control es inválido y fue tocado.
  - Marca visualmente el input con la clase `.error` y muestra `*` si el campo es requerido (`isRequired` computed).
- **Ejemplo real de uso**:
  ```html
  <app-input
    label="Correo Electrónico"
    type="email"
    formControlName="email">
  </app-input>
  ```
- **Cuándo usarlo**: En cualquier formulario reactivo. **NUNCA crear elementos `<input>` directos** si se puede usar `app-input`.

### `CustomButtonComponent` (`app-button`)
- **Ruta**: `src/app/shared/components/custom-button/custom-button.component.ts`
- **Propósito**: Botón tipado reutilizable con Angular 19 Signals, accesible, con variantes temáticas y soporte de estados loading/disabled.
- **Inputs**:
  - `text`: `input<string>('')`
  - `variant`: `input<'primary' | 'secondary' | 'outline' | 'danger'>('primary')`
  - `size`: `input<'sm' | 'md' | 'lg'>('md')`
  - `type`: `input<'button' | 'submit' | 'reset'>('button')`
  - `fullWidth`: `input<boolean>(false)`
  - `loading`: `input<boolean>(false)`
  - `disabled`: `input<boolean>(false)`
  - `customClass`: `input<string>('')`
  - `ariaLabel`: `input<string>('')`
  - `title`: `input<string>('')`
- **Outputs**:
  - `onClick`: `output<MouseEvent>()`
- **Ejemplo real de uso**:
  ```html
  <app-button
    text="Random Novel"
    variant="primary"
    [fullWidth]="true"
    (onClick)="obtenerNovela()"
  />
  ```
- **Cuándo usarlo**: En cualquier acción de usuario o menú lateral. **NUNCA crear elementos `<button>` directos** con estilos duplicados si se puede usar `app-button`.

---

## 2. Componentes de Feedback y Carga

### `LoadingSpinnerComponent` (`app-loading-spinner`)
- **Ruta**: `src/app/shared/components/loading-spinner/loading-spinner.component.ts`
- **Propósito**: Muestra un spinner animado circular para estados de carga asíncronos.
- **Cuándo usarlo**: Durante llamadas HTTP o transiciones de carga pesadas.
- **Ejemplo real de uso**:
  ```html
  @if (isLoading()) {
    <app-loading-spinner></app-loading-spinner>
  }
  ```

### `ToastComponent` y `ToastItemComponent` (`app-toast`)
- **Ruta**: `src/app/shared/components/toast/toast.component.ts`
- **Propósito**: Contenedor flotante en la esquina superior derecha para mensajes de notificación efímeros (`success`, `error`, `warning`, `info`).
- **Cómo consumirlo**: Se invoca a través del servicio inyectable `ToastService` (`toastService.showSuccess(...)`).

---

## 3. Componentes de Sistema y Configuración

### `ThemeSwitcherComponent` (`app-theme-switcher`)
- **Ruta**: `src/app/core/components/theme-switcher/theme-switcher.component.ts`
- **Propósito**: Botón de alternancia entre tema claro y tema oscuro (Dark Mode).
- **Ubicación habitual**: Navbar superior.

---

## 4. Componentes de Dominio de Novelas

### `TagComponent` (`novels-tag`)
- **Ruta**: `src/app/features/novels/components/tag/tag.component.ts`
- **Propósito**: Badge o chip para mostrar géneros y etiquetas de novelas con estilos consistentes.

### `RandomNovelComponent` (`novels-random-novel`)
- **Ruta**: `src/app/features/novels/components/random-novel/random-novel.component.ts`
- **Propósito**: Presenta una novela recomendada al azar con portada, sinopsis y botón de lectura.

### Carruseles Publicitarios (`AdsCarouselComponent`, `JapaneseAdsComponent`)
- **Ruta**: `src/app/ads/ads-carousel/` y `src/app/ads/japanese-ads/`
- **Propósito**: Banners publicitarios temáticos en el home y barras laterales.
