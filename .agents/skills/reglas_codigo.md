# Reglas Técnicas de Código — Frontend Angular 19

## 1. Componentes y Angular 19
- Todos los componentes deben ser `standalone: true`.
- Todos los componentes deben usar `changeDetection: ChangeDetectionStrategy.OnPush`.
- Inyección de dependencias exclusivamente mediante la función `inject()`.
- Control flow con `@if`, `@for (...; track ...)` y `@switch`. Prohibido `*ngIf` y `*ngFor`.
- En componentes Dumb (presentacionales), usar `input()` y `output()` nativos con Signals.

## 2. Formularios y UI
- No usar `<input>` HTML nativo suelto en nuevas vistas: usar `CustomInputComponent` (`app-input`).
- No usar `<button>` HTML nativo suelto con clases inline: usar `CustomButtonComponent` (`app-button`).
- No usar etiquetas `<a>` o `<span>` con gradientes inline para géneros o tags: usar `CustomBadgeComponent` (`app-badge`).
- Usar `ActionHandler` para ejecutar operaciones de envío y asociar toasts automáticos.
- Límite de 200 líneas por componente. Dividir vistas complejas en secciones modulares Dumb.
- Componentes Dumb 100% aislados: cero inyecciones de `Router`, `Store`, `HttpClient` o estado global; solo reciben datos vía `input()` con prefijos estándar (`vcLabel`, `arrLinks`) y emiten eventos vía `output()`.
- Extraer cálculos o lógica pesada a funciones puras testeables fuera de los componentes.

## 3. Estilos, Tokens y Medidas
- Párrafos de texto usan por defecto `text-[16px] font-normal` si el diseño no especifica otra medida.
- Título de cards informativas usa `text-[20px] font-semibold`.
- Si el diseño especifica medidas exactas en px, usar la medida exacta (`text-[20px]`, `h-[60px]`, `gap-[15px]`).
- Todo elemento con `truncate` o `line-clamp-*` debe incluir obligatoriamente el atributo `[title]="textoSinRecortar"`.
- Los componentes compartidos nunca deben hardcodear `w-full` o `h-*` en su clase base; deben recibirlo o permitir override del consumidor.
- **Regla contra doble anillo perimetral**: En elementos con fondo semitransparente (como `color-mix` al 20%), el borde en reposo debe ser `border-2 border-transparent` (para que el fondo fluya uniformemente sin sumar opacidades alfa al 36%). Solo en `:hover` se ilumina el borde con `hover:border-[var(--color-primary)]`.
- **Variantes White**: `variant="white"` usa fondo blanco, texto negro y borde blanco; `variant="outline-white"` usa fondo negro, texto blanco y borde negro. Ambas variantes son **sin hover** cromático.

## 4. Estado y Reactividad
- Usar Signals para estado sincrónico (`signal`, `computed`).
- Usar RxJS para streams asíncronos y HTTP.
- Toda suscripción manual debe usar `takeUntilDestroyed(destroyRef)` para prevenir fugas de memoria.

## 5. Prevención de Prop Drilling y Uso de Servicios / Fachadas
- **¿Cuándo usar Servicios / Fachadas (`Facade`)?**:
  - Cuando un dato o estado debe ser compartido transversalmente por varios componentes en ramas jerárquicas distintas (ej. sesión de usuario, permisos, tema visual, árbol de navegación global).
  - En contenedores Smart de alto nivel (como Layouts o Páginas) para orquestar la obtención de datos y exponer Signals (`navTree`, `isLoading`) listos para el consumo.
  - Para evitar transportar propiedades a través de 3 o más niveles de componentes intermedios pasivos que no usan esos datos ("prop drilling").
- **¿Cuándo NO usar Servicios / Fachadas?**:
  - Dentro de **Componentes Dumb / Presentacionales**: Prohibido inyectar servicios en componentes de presentación (como `NavbarComponent`, `CustomButtonComponent`, cards de listas). Estos deben mantenerse 100% agnósticos y desacoplados, recibiendo información por `input()` y emitiendo eventos por `output()`.
  - Cuando la comunicación es estrictamente directa entre un padre inmediato y su hijo (1 solo salto): usar directamente `input()` y `output()`.
  - Para estado local efímero de UI (ej. acordeón abierto, tooltip visible, menú desplegable abierto): usar `signal()` local interno en el componente dumb.

## 6. Utilidad Dash para Valores Nulos o No Definidos (`dashText`, `dashNumber`)
- **Ámbito Exclusivo Frontend / Presentación**: `dashText`, `dashNumber` y el pipe `dash` se utilizan única y exclusivamente en la capa visual (UI) para evitar pintar en pantalla `null`, `undefined` o cadenas vacías, mostrando un elegante `'-'`.
- **Prohibido en Payloads / Mutaciones**: Jamás se debe enviar un guión `'-'` al backend en payloads de creación o actualización (`POST`, `PUT`, `PATCH`). Hacia la API, los campos opcionales o vacíos deben viajar como `null`, `undefined` o ser omitidos según el DTO correspondiente.
- **Backend Libre de Dash**: En el backend (NestJS/MongoDB), las entidades y bases de datos deben preservar sus tipos primitivos puros (`null`, valores por defecto o ausencia de clave) sin adulterar los datos persistidos con caracteres de presentación visual.
