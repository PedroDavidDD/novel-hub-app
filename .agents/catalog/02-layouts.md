# Catálogo de Layouts — Frontend Angular 19

Este catálogo documenta los componentes de layout que estructuran la pantalla para cada tipo de vista.

---

## 1. `NovelsLayoutComponent` (Layout Principal de Contenido)

- **Ruta**: `src/app/features/novels/layout/novels-layout/novels-layout.component.ts`
- **Selector**: `app-novels-layout`
- **Estructura**:
  - `NavbarComponent`: Barra superior fija con buscador, cambio de tema y menú de usuario.
  - `<router-outlet>`: Contenido principal de la página.
  - `AsideComponent`: Barra lateral para navegación secundaria, anuncios y filtros rápidos.
  - `FooterComponent`: Pie de página informativo con enlaces y copyright.
- **Cuándo utilizarlo**: En todas las vistas públicas de lectura, catálogo de novelas y páginas informativas.

---

## 2. `AuthLayoutComponent` (Layout de Autenticación)

- **Ruta**: `src/app/features/auth/layout/auth-layout/auth-layout.component.ts`
- **Selector**: `app-auth-layout`
- **Estructura**:
  - Contenedor centrado y limpio sin distracciones (sin aside completo).
  - Fondo tematizado con tarjeta centrada para los formularios de login, registro o recuperación.
- **Cuándo utilizarlo**: En todas las rutas que cuelgan de `/#/auth/*` (Login, Register, Password Reset).

---

## 3. Componentes Estructurales Reutilizables

### `NavbarComponent` (`app-navbar`)
- **Ruta**: `src/app/shared/layout/navbar/navbar.component.ts`
- **Subcomponentes**:
  - `NavbarSearchComponent`: Modal/input de búsqueda en tiempo real de novelas.
  - `NavbarUserMenuComponent`: Menú desplegable con avatar, rol, enlaces a perfil y botón de cerrar sesión.

### `AsideComponent` (`app-aside`)
- **Ruta**: `src/app/shared/layout/aside/aside.component.ts`
- **Propósito**: Panel lateral colapsable o fijo para anuncios y rankings.

### `FooterComponent` (`app-footer`)
- **Ruta**: `src/app/shared/layout/footer/footer.component.ts`
- **Propósito**: Pie de página institucional.
