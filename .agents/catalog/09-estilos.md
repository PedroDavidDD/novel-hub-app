# Catálogo de Estilos, Temas y Tokens — Frontend Angular 19

Este catálogo documenta los tokens de diseño, CSS variables, paleta de colores y modo oscuro en `novel-hub-app`.

---

## 1. Variables de Color y Tokens (`src/styles.css`)

El proyecto centraliza sus variables de diseño en `:root` y la clase `.dark`:

### Paleta Principal
- **Primary**: `var(--color-primary)` (`rgb(255, 200, 0)` oro/amarillo característico)
  - `primary-light`: `rgb(255, 211, 51)`
  - `primary-dark`: `rgb(255, 158, 0)`
- **Secondary**: `var(--color-secondary)` (`rgb(0, 255, 200)` turquesa/cian)
- **Estados**:
  - `--color-error`: `#bb2929`
  - `--color-success`: `#1ed12d`
  - `--color-info`: `#0791e6`
  - `--color-alert`: `#ffcf00`

### Fondos y Superficies
- **Modo Claro**:
  - Fondo: `#ededed`
  - Texto principal: `#16151d`
  - Navbar: `#ffffff`
  - Superficie / Cards: `#ffffff`
- **Modo Oscuro (`.dark`)**:
  - Fondo: `#16151d`
  - Texto principal: `#ffffff`
  - Navbar: `#16151d`
  - Superficie / Cards: `#1e1d27`

---

## 2. Tipografía y Escala

- **Familia principal**: Inter / Roboto / System Sans-serif.
- **Párrafos (`<p>`, descripciones)**: `text-[16px] font-normal` por defecto.
- **Títulos de Cards informativas**: `text-[20px] font-semibold`.
- **Texto truncado**: Todo texto recortado con `truncate` o `line-clamp-*` debe llevar `[title]="textoCompleto"`.

---

## 3. Sombras y Transiciones

- Sombras: `--shadow-light`, `--shadow-medium`, `--shadow-dark`.
- Transiciones: `--transition-fast` (`all 0.3s ease`).
- Botones: Bordes redondeados píldora `border-radius: 25px`, padding estándar `--space-sm --space-md`.

---

## 4. Tokens de Diseño para Componentes Reutilizables

### Botones (`CustomButtonComponent` / `app-button`)
- **Tokens de Color y Variantes**:
  - `primary`: Sólido `bg-[var(--button-primary-bg)] text-[var(--button-tc)] hover:bg-[var(--button-primary-bg-hover)] shadow-sm`.
  - `secondary`: Sólido `bg-[var(--button-secondary-bg)] text-[var(--button-tc)] hover:bg-[var(--button-secondary-bg-hover)] shadow-sm`.
  - `outline-primary`: Fondo translúcido tonal `bg-[color-mix(in_srgb,var(--button-primary-bg)_20%,transparent)]`, borde perimetral invisible en reposo `border-2 border-transparent` (para no generar anillo oscuro de doble opacidad), texto `text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]`. En hover ilumina con `hover:border-[var(--color-primary)] hover:bg-[var(--button-primary-bg)] hover:text-[var(--button-tc)]`.
  - `outline-secondary`: Homólogo para paleta secundaria.
  - `white`: Fondo blanco puro `bg-white`, texto `text-black`, borde `border-2 border-white`. **Sin hover cromático**.
  - `outline-white`: Fondo negro puro `bg-black`, texto `text-white`, borde `border-2 border-black`. **Sin hover cromático**.
  - `danger`: Fondo `bg-[var(--color-error)] text-white`.
- **Formas (`rounded`)**: `full` (`rounded-[25px]`), `xl` (`rounded-xl`), `lg` (`rounded-lg`), `md` (`rounded-md`), `none`.
- **Micro-interacciones**: `active:scale-95 transition-all select-none`.

### Badges y Chips de Género (`CustomBadgeComponent` / `app-badge`)
- **Propósito**: Componente Dumb presentacional para tags, categorías y géneros.
- **Variante `primary` (Tonal Brand)**:
  - Fondo: `bg-[color-mix(in_srgb,var(--button-primary-bg)_20%,transparent)]`.
  - Borde en reposo: `border-2 border-transparent` (evita superposición alfa con el fondo).
  - Borde en hover: `hover:border-[var(--color-primary)]` (se ilumina el contorno amarillo al pasar el cursor).
  - Texto: `text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]`.
  - Escala y Forma: `rounded-full px-3 py-1 text-sm font-medium hover:translate-y-[-1px] hover:shadow-md`.
- **Variante `neutral`**: `bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-black)] hover:border-[var(--color-border)]`.
