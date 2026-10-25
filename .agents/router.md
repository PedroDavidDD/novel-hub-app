# Router de Memoria Ejecutable — Frontend Angular 19 (NovelHub)

Este archivo es el **enrutador principal** del conocimiento del frontend de NovelHub.
Cualquier agente o desarrollador que trabaje en `novel-hub-app` **DEBE** consultar este router antes de implementar componentes, páginas, servicios, formularios o estilos.

---

## 🎯 Reglas Fundamentales de Consulta (Lazy Loading)

1. **No asumir información**: Si no conoces un patrón o componente existente, consulta el archivo específico en este índice.
2. **Reutilizar antes de crear**: Antes de crear un input, botón, modal, alert o toast, revisa `catalog/01-componentes.md`, `catalog/05-fileupload.md` y `catalog/06-modales.md`. Ya existen componentes listos (`CustomInputComponent`, `FileUploaderComponent`, `ModalAlertService`, etc.).
3. **Angular 19 Moderno**: Todos los componentes deben ser `standalone: true`, `ChangeDetectionStrategy.OnPush`, y usar `@if`, `@for`, `@switch` (nunca `*ngIf`, `*ngFor`).
4. **Signals First**: Prioriza Signals (`signal()`, `computed()`, `input()`) para estado sincrónico. RxJS se reserva para eventos asíncronos y llamadas HTTP.
5. **Pattern Result & Adapters**: Las llamadas al API transforman los DTOs del backend en modelos de dominio usando adapters y retornan `Result<T>`.

---

## 🗺️ Índice del Sistema de Conocimiento

### Documentación General (`docs/`)
| Archivo | Propósito | Cuándo consultarlo |
|---|---|---|
| [`docs/01-requerimientos.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/docs/01-requerimientos.md) | Propósito de la aplicación web, módulos funcionales y experiencia de usuario. | Al entender la visión global del frontend y sus flujos. |
| [`docs/02-arquitectura.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/docs/02-arquitectura.md) | Arquitectura Angular 19, `core`, `features`, `shared`, Smart vs Dumb, inject(), OnPush. | Al estructurar nuevos componentes, servicios o módulos de funcionalidad. |
| [`docs/03-modelo_datos.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/docs/03-modelo_datos.md) | Modelos de dominio frontend, interfaces de DTO del backend y adaptadores. | Al mapear datos recibidos del backend o crear interfaces de vistas. |
| [`docs/04-modelo_funcional.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/docs/04-modelo_funcional.md) | Flujo de autenticación, AuthFacade, guards, gestión de roles y permisos en vistas. | Al asegurar vistas por roles o manipular el estado de sesión. |
| [`docs/05-build_despliegue.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/docs/05-build_despliegue.md) | Comandos de ejecución (`ng serve`), compilación con Tailwind y pruebas unitarias. | Al levantar el frontend localmente o compilar el bundle. |

### Catálogo de Piezas Reutilizables (`catalog/`)
| Archivo | Propósito | Cuándo consultarlo |
|---|---|---|
| [`catalog/01-componentes.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/01-componentes.md) | Componentes UI reutilizables: `CustomInputComponent`, `LoadingSpinner`, `ThemeSwitcher`, tags, carruseles de ads. | Antes de crear cualquier elemento visual para no duplicar. |
| [`catalog/02-layouts.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/02-layouts.md) | Layouts disponibles: `NovelsLayoutComponent`, `AuthLayoutComponent`, Navbar, Aside, Footer. | Al agregar nuevas páginas para elegir el layout contenedor correcto. |
| [`catalog/03-formularios.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/03-formularios.md) | Formularios Reactivos, `ControlValueAccessor`, validaciones, tokens de error y `ActionHandler`. | Al implementar formularios de login, registro, creación de novelas o capítulos. |
| [`catalog/04-tablas.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/04-tablas.md) | Grillas de novelas, filtros reactivos con Signals, estrategias de ordenamiento (`SORT_STRATEGIES`). | Al crear bandejas de datos, catálogos o listados filtrables. |
| [`catalog/05-fileupload.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/05-fileupload.md) | `FileUploaderComponent`: drag & drop, previsualización, validación de tipos y tamaños. | Al requerir subida de portadas de novelas o documentos. |
| [`catalog/06-modales.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/06-modales.md) | `ModalAlertService` (servicio dinámico con `Promise<boolean>`), `ModalComponent` y `ToastService`. | Al mostrar confirmaciones, alertas, mensajes de éxito o diálogos modales. |
| [`catalog/07-hooks.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/07-hooks.md) | Servicios de estado con Signals (`AuthFacade`, `ToastService`), utilidades (`ActionHandler`), Directivas (`HasPermission`). | Al gestionar estado reactivo o conectar componentes con servicios. |
| [`catalog/08-api.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/08-api.md) | Cliente HTTP, `AuthInterceptor`, servicios de API, Pattern Result y social adapters. | Al consumir endpoints del backend NestJS. |
| [`catalog/09-estilos.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/09-estilos.md) | Tailwind CSS, tokens de diseño en `:root`, variables CSS y tema oscuro/claro. | Al maquetar UI para aplicar colores, espaciados y transiciones oficiales. |
| [`catalog/10-ejemplos.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/catalog/10-ejemplos.md) | Cookbook paso a paso: Crear una página filtrable con signals, crear un formulario con ActionHandler, etc. | Al implementar una tarea nueva para copiar la arquitectura exacta. |
| [`catalog/11-decisiones.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/nest-novel-hub-app/.agents/catalog/11-decisiones.md) | Decisiones arquitectónicas (Signals first, OnPush mandatory, HashLocation, Adapter pattern). | Al evaluar decisiones técnicas en el frontend. |

### Reglas de Código y Roles (`skills/` y `agents/`)
| Archivo | Propósito |
|---|---|
| [`skills/reglas_codigo.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/skills/reglas_codigo.md) | Reglas técnicas Angular 19, OnPush, inject(), no logic in templates, barrels. |
| [`agents/frontend_agent.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/agents/frontend_agent.md) | Perfil del agente especialista en Angular 19 y Tailwind. |
| [`agents/backend_agent.md`](file:///E:/Cursos%20Por%20Aprender%20Udemy/Angular/novel-hub/novel-hub-app/.agents/agents/backend_agent.md) | Perfil del agente de coordinación backend. |

---

## 🧭 Enrutamiento Rápido por Tarea

| Si tu tarea es... | Lee únicamente: |
|---|---|
| **Crear una nueva pantalla / página** | `catalog/02-layouts.md` → `catalog/10-ejemplos.md` → `catalog/01-componentes.md` |
| **Crear un formulario** | `catalog/03-formularios.md` → `catalog/01-componentes.md` → `catalog/07-hooks.md` |
| **Subir imágenes / archivos** | `catalog/05-fileupload.md` → `catalog/03-formularios.md` |
| **Mostrar alertas o modales de confirmación** | `catalog/06-modales.md` |
| **Consumir un endpoint del backend** | `catalog/08-api.md` → `docs/03-modelo_datos.md` |
| **Listar y filtrar datos con Signals** | `catalog/04-tablas.md` → `catalog/10-ejemplos.md` |
