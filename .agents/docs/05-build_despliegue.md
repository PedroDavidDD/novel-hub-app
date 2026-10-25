# Build y Despliegue — Frontend Angular 19

## 1. Requisitos Previos

- **Node.js**: v18.x o v20.x
- **Angular CLI**: v19.x (`@angular/cli`)

---

## 2. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:4200
npm start

# Compilar para producción (genera carpeta dist/)
npm run build

# Compilar en modo desarrollo con watch
npm run watch
```

---

## 3. Pruebas Unitarias

```bash
# Ejecutar todas las pruebas unitarias con Karma
npm test

# Ejecutar un archivo de test específico
npx ng test --include=**/custom-input.component.spec.ts
```

---

## 4. Estilos y Tailwind

Tailwind CSS se compila automáticamente mediante el pipeline de Angular CLI (configurado en `angular.json` y `tailwind.config.js`).
Si se agregan nuevas clases personalizadas, agregarlas en `src/styles.css`.
