# Cookbook de Ejemplos de Referencia — Frontend Angular 19

Este catálogo sirve como guía práctica para implementar nuevos requerimientos en el frontend imitando los mejores ejemplos reales existentes.

---

## 1. Quiero crear una Página de Catálogo con Filtros y Signals

- **Archivo de referencia**: `src/app/features/novels/pages/novels-page/novels-page.component.ts`
- **Por qué**:
  - Utiliza `ChangeDetectionStrategy.OnPush`.
  - Declara filtros como `signal(...)`.
  - Extrae estrategias de ordenamiento fuera del componente (`SORT_STRATEGIES`).
  - Utiliza un `computed(...)` para recalcular la lista filtrada automáticamente sin triggers manuales.
  - En la plantilla usa el nuevo control flow `@for (novel of filteredNovels(); track novel.id) { ... } @empty { ... }`.

---

## 2. Quiero crear un Formulario Reactivo con Validación y Feedback

- **Archivo de referencia**: `src/app/features/auth/pages/login-page/login-page.component.ts`
- **Por qué**:
  - Inyecta dependencias con `inject()`.
  - Construye el formulario con `FormBuilder` y tipado estricto.
  - Ejecuta la llamada al servicio mediante `ActionHandler` (`this.actionHandler.execute(...)`), automatizando el loading y los toasts.
  - Implementa `isValidField()` y `getFieldError()` en caso de requerir validación explícita.

---

## 3. Quiero crear un Componente de Input Reutilizable (CVA)

- **Archivo de referencia**: `src/app/shared/components/custom-input/custom-input.component.ts`
- **Por qué**: Muestra cómo implementar `ControlValueAccessor` en Angular 19 moderno con Signals (`input()`, `signal()`, `computed()`) y enlace automático al token de errores `FORM_ERRORS`.

---

## 4. Quiero mostrar una Alerta o Diálogo de Confirmación

- **Archivo de referencia**: `src/app/shared/services/modal-alert.service.ts`
- **Por qué**: Permite invocar `await this.modalAlertService.alert({ type: 'confirm', ... })` devolviendo un booleano sin ensuciar el HTML del componente con modales estáticos.
