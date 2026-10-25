# Decisiones Arquitectónicas — Frontend Angular 19

Este documento recopila las decisiones técnicas inmutables del frontend que **DEBEN respetarse siempre**:

---

## 1. Decisiones Principales

1. **Angular 19 Standalone Exclusivo**:
   - Prohibido el uso de `NgModule`.
   - Todos los componentes, directivas y pipes deben ser `standalone: true`.

2. **Detección de Cambios `OnPush` Obligatoria**:
   - Todo componente debe incluir `changeDetection: ChangeDetectionStrategy.OnPush`.

3. **Signals First para Estado Sincrónico**:
   - Usar `signal()` y `computed()` para filtros, visibilidad, carga y selecciones locales.
   - Usar `input()` y `output()` nativos de Angular 19 en lugar de los decoradores `@Input` y `@Output` clásicos.
   - RxJS se reserva estrictamente para llamadas HTTP y eventos asíncronos complejos.

4. **Prohibido `*ngIf` y `*ngFor`**:
   - Usar exclusivamente la sintaxis moderna de control flow `@if`, `@for (...; track id)`, `@switch`.

5. **Pattern Result en Servicios**:
   - Los servicios capturan errores HTTP con `catchError` y retornan instancias de `Result<T>`. Los componentes nunca reciben excepciones HTTP no controladas.

6. **Pattern Adapter (DTO -> Domain)**:
   - Los DTOs recibidos del backend se transforman en entidades de dominio antes de ser entregados a los componentes.

7. **Prohibido usar `<input>` HTML nativo suelto en nuevas vistas**:
   - Reutilizar `CustomInputComponent` (`app-input`) del catálogo global.

8. **Texto Truncado con `title` obligatorio**:
   - Todo elemento con `truncate` o `line-clamp-*` debe incluir `[title]="textoCompleto"`.
