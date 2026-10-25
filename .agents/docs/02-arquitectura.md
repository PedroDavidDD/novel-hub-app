# Arquitectura Técnica — Frontend Angular 19

## 1. Stack Tecnológico

- **Framework**: Angular 19 (Standalone Components, sin NgModules)
- **Lenguaje**: TypeScript 5.7+
- **Estilos**: Tailwind CSS 3.4 + Custom CSS Variables
- **Reactividad**: Angular Signals (`signal()`, `computed()`, `input()`, `output()`) + RxJS 7.8
- **Autenticación**: JWT con interceptor HTTP y `angular-oauth2-oidc`
- **Testing**: Jasmine 5.5 + Karma 6.4

---

## 2. Organización del Código: Clean Architecture & Feature-Driven

```
src/app/
├── core/                    # Singleton services, interceptors, guards y tokens
│   ├── components/          # ThemeSwitcher y componentes de infraestructura
│   ├── constants/           # Constantes globales de auth y sesión
│   ├── guards/              # AuthGuard, NotAuthenticatedGuard, PermissionGuard
│   ├── interceptors/        # AuthInterceptor (agrega token Bearer)
│   ├── models/              # Result<T>, UserModel
│   ├── services/            # AuthFacade, PermissionService, RolesService
│   └── tokens/              # Tokens de DI (ej. FORM_ERRORS)
├── features/                # Bounded Contexts de la aplicación
│   ├── auth/                # Módulo de autenticación y perfil
│   │   ├── adapters/        # Transformación DTO Backend <-> Domain Model
│   │   ├── components/      # Botones sociales y componentes específicos
│   │   ├── pages/           # LoginPage, RegisterPage, ProfilePage
│   │   ├── services/        # AuthService, SocialAuthService
│   │   └── auth.routes.ts   # Enrutamiento hijo
│   └── novels/              # Módulo de catálogo y lectura
│       ├── components/      # NovelDetail, RandomNovel, Tag
│       ├── layout/          # NovelsLayoutComponent
│       ├── pages/           # HomePage, NovelsPage, NovelPage, ChapterPage
│       ├── services/        # NovelsService con Signals
│       └── novels.routes.ts # Enrutamiento hijo
└── shared/                  # Componentes, directivas, pipes y layouts comunes
    ├── components/          # CustomInput, FileUploader, LoadingSpinner, Modal, ModalAlert, Toast
    ├── directives/          # HasPermissionDirective
    ├── layout/              # Aside, Footer, Navbar
    ├── pipes/               # TruncatePipe
    ├── services/            # ModalAlertService, ToastService
    └── utils/               # ActionHandler
```

---

## 3. Patrones Fundamentales

### A. Smart vs Dumb Components
- **Smart (Containers / Pages)**: Inyectan servicios o facades (`AuthFacade`, `NovelsService`), gestionan señales de estado y orquestan acciones.
- **Dumb (Presentational)**: Reciben datos mediante `input()` y emiten eventos mediante `output()`. No conocen llamadas HTTP.

### B. Inyección de Dependencias Moderna: `inject()`
No usar constructores con inyecciones largas. Usar la función `inject()`:
```typescript
private readonly authFacade = inject(AuthFacade);
private readonly router = inject(Router);
```

### C. Estrategia de Detección de Cambios: `OnPush` Obligatoria
Todo componente nuevo **DEBE** declarar:
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

### D. Control Flow Moderno
Prohibido el uso de directivas estructurales antiguas (`*ngIf`, `*ngFor`, `*ngSwitch`). Usar la sintaxis nativa:
```html
@if (condition) { ... } @else { ... }
@for (item of items(); track item.id) { ... }
```
