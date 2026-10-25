# Requerimientos del Sistema — Frontend Angular 19 (NovelHub)

## 1. Propósito del Proyecto

**NovelHub Frontend** es una Single Page Application (SPA) moderna desarrollada en **Angular 19** con soporte de componentes Standalone y Tailwind CSS. Permite a los usuarios:
1. Explorar un catálogo extenso de novelas con filtros en tiempo real (idioma, estado, género y criterios de ordenamiento).
2. Consultar la ficha técnica completa de cada novela (sinopsis, géneros, tags, nombres asociados, calificación).
3. Leer capítulos ordenados por volumen y número de entrega.
4. Autenticarse mediante credenciales clásicas (email/contraseña) o proveedores sociales (Google, Facebook).
5. Gestionar su perfil, avatar, biografía y selección de raza del lore.
6. Cambiar dinámicamente entre modo claro y modo oscuro mediante `ThemeSwitcher`.

---

## 2. Módulos y Rutas Principales

| Módulo / Feature | Ruta Angular | Descripción |
|---|---|---|
| **Home** | `/#/` | Portada con carruseles de publicidad, novelas destacadas y novedades. |
| **Novelas** | `/#/novels` | Catálogo de búsqueda filtrable con signals reactivos. |
| **Detalle Novela** | `/#/novels/:id` | Ficha técnica y lista de capítulos de la novela. |
| **Capítulo** | `/#/novels/:id/chapter/:chapId` | Interfaz de lectura de capítulo. |
| **Login** | `/#/auth/login` | Formulario de inicio de sesión con botones sociales. |
| **Registro** | `/#/auth/register` | Formulario de creación de cuenta. |
| **Perfil** | `/#/auth/profile` | Vista y edición de perfil de usuario. |
| **Ajustes** | `/#/auth/settings` | Configuración de cuenta y preferencias. |
| **Error 404** | `/#/404` | Página amigable de recurso no encontrado. |
| **Mantenimiento** | `/#/maintenance` | Pantalla de estado de servicio no disponible. |

---

## 3. Experiencia de Usuario y Accesibilidad

- **Hash-based Routing (`/#/path`)**: Garantiza compatibilidad sin requerir reescrituras de servidor en despliegues estáticos.
- **Dark Mode**: Soporte nativo de tema oscuro persistido en `localStorage` mediante la clase `.dark` en el elemento raíz HTML.
- **Feedback Inmediato**: Retroalimentación mediante notificaciones flotantes no intrusivas (`ToastService`) y diálogos modales tipados (`ModalAlertService`).
