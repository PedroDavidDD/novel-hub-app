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
