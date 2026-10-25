# Reglas Técnicas de Código — Frontend Angular 19

## 1. Componentes y Angular 19
- Todos los componentes deben ser `standalone: true`.
- Todos los componentes deben usar `changeDetection: ChangeDetectionStrategy.OnPush`.
- Inyección de dependencias exclusivamente mediante la función `inject()`.
- Control flow con `@if`, `@for (...; track ...)` y `@switch`. Prohibido `*ngIf` y `*ngFor`.
- En componentes Dumb (presentacionales), usar `input()` y `output()` nativos con Signals.

## 2. Formularios y UI
- No usar `<input>` HTML nativo suelto en nuevas vistas: usar `CustomInputComponent` (`app-input`).
- Usar `ActionHandler` para ejecutar operaciones de envío y asociar toasts automáticos.
- Límite de 200 líneas por componente. Dividir vistas complejas en secciones modulares Dumb.
- Extraer cálculos o lógica pesada a funciones puras testeables fuera de los componentes.

## 3. Estilos y Medidas
- Párrafos de texto usan por defecto `text-[16px] font-normal` si el diseño no especifica otra medida.
- Título de cards informativas usa `text-[20px] font-semibold`.
- Si el diseño especifica medidas exactas en px, usar la medida exacta (`text-[20px]`, `h-[60px]`, `gap-[15px]`).
- Todo elemento con `truncate` o `line-clamp-*` debe incluir obligatoriamente el atributo `[title]="textoSinRecortar"`.
- Los componentes compartidos nunca deben hardcodear `w-full` o `h-*` en su clase base; deben recibirlo o permitir override del consumidor.

## 4. Estado y Reactividad
- Usar Signals para estado sincrónico (`signal`, `computed`).
- Usar RxJS para streams asíncronos y HTTP.
- Toda suscripción manual debe usar `takeUntilDestroyed(destroyRef)` para prevenir fugas de memoria.
