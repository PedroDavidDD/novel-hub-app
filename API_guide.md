# API Guide - Novel Hub App

Documentación completa de la API REST del backend NestJS.

---

## Autenticación con JWT y uso en Postman

### Flujo de autenticación

1. **Registro**: El usuario se registra en `/auth/register`. Recibe un `token` (Access Token) y un `refreshToken`.
2. **Login**: El usuario inicia sesión en `/auth/login`. Recibe un `token` (Access Token) y un `refreshToken`.
3. **Uso del token**: En Postman, agrega el token en el header `Authorization` con el formato: `Bearer <tu_token>`
4. **Refrescar Token**: Cuando el `token` expira, usa el endpoint `/auth/refresh` enviando el `refreshToken` en el header o body (según implementación) para obtener uno nuevo.

### Cómo usar el token en Postman

1. Después de hacer login o registro, copia el `token` de la respuesta (dentro de `data`).
2. En Postman, ve a la pestaña **Headers** de tu request.
3. Agrega una nueva header:
   - **Key**: `Authorization`
   - **Value**: `Bearer <tu_token_aqui>`
4. Envía la request a endpoints protegidos.

### Acerca del Logout

El endpoint `POST /auth/logout` **invalida el Refresh Token** en el servidor (borrándolo de la base de datos).

**Qué hace el endpoint:**

- Requiere estar autenticado (`Bearer token`).
- **Backend:** Elimina el `hashedRefreshToken` de la base de datos. Esto impide que el usuario pueda "refrescar" su sesión cuando el token actual expire.
- **Frontend (CRÍTICO):** El Backend NO puede borrar el token de la memoria del navegador/cliente. Es **responsabilidad del Frontend** eliminar el `accessToken` y `refreshToken` del almacenamiento local (LocalStorage/Cookies) inmediatamente al recibir la confirmación de logout.
- **Seguridad:** Aunque el `accessToken` siga siendo válido matemáticamente hasta su expiración (minutos), el usuario ya no podrá renovarlo. Para una seguridad absoluta (revoke inmediato), el Frontend debe olvidar el token.
  > ⚠️ **Nota de Seguridad**: Si un atacante roba el `accessToken` antes de que el usuario haga logout, podrá usarlo hasta que expire (ej: 1 hora). Para mitigar esto, se recomienda usar tiempos de expiración cortos (15 min) o implementar "Token Versioning" (incrementar una versión en DB al hacer logout).

---

## Formato de Respuesta

Todas las respuestas siguen este formato estandarizado (`ApiResponse`):

```json
{
  "statusCode": 1,
  "data": { ... },
  "msg": "Mensaje de éxito (opcional)"
}
```

- `statusCode: 1` = Éxito
- `statusCode: 0` = Error

---

## Módulo de Autenticación (`/auth`)

### 1. Registro de Usuario

**Endpoint**: `POST /auth/register`

Registra un nuevo usuario en el sistema y devuelve sus credenciales.

**Headers**: `Content-Type: application/json`

**Body (JSON)**:

```json
{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "username": "juanperez",
  "password": "123456"
}
```

**Respuesta exitosa (201)**:

```json
{
  "statusCode": 1,
  "data": {
    "user": {
      "id": "...",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "username": "juanperez",
      "isActive": true,
      "roles": ["ROLE_HOME", "ROLE_NOVELS"]
    },
    "token": "eyJhbGciOiJIUz...",
    "refreshToken": "eyJhbGciOiJIUz...",
    "tokenExpiresIn": 3600,
    "refreshTokenExpiresIn": 86400
  },
  "msg": "El caballero se ha registrado correctamente"
}
```

---

### 2. Inicio de Sesión

**Endpoint**: `POST /auth/login`

Autentica al usuario y devuelve un token JWT y Refresh Token.

**Headers**: `Content-Type: application/json`

**Body (JSON)**:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": {
    "user": {
      "id": "...",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "roles": [...]
    },
    "token": "eyJhbGciOiJIUz...",
    "refreshToken": "eyJhbGciOiJIUz...",
    "tokenExpiresIn": 3600,
    "refreshTokenExpiresIn": 86400
  },
  "msg": "Bienvenido, te has logueado correctamente"
}
```

---

### 3. Cerrar Sesión (Logout)

**Endpoint**: `POST /auth/logout`

Cierra la sesión del usuario actual (Invalida el Refresh Token en servidor).

**Headers**:

- `Authorization: Bearer <tu_token>`

**Body**: No requiere body

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": null,
  "msg": "Sesión cerrada correctamente. Por favor elimine el token del cliente."
}
```

---

### 4. Refrescar Token

**Endpoint**: `POST /auth/refresh`

Renueva el token de acceso usando el Refresh Token.

**Headers**:

- `Authorization: Bearer <tu_refresh_token>` (O puede enviarse en body según config del cliente)

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": {
    "user": { ... },
    "token": "nuevo_access_token",
    "refreshToken": "nuevo_refresh_token",
    "tokenExpiresIn": 3600,
    "refreshTokenExpiresIn": 86400
  },
  "msg": "Token refrescado correctamente"
}
```

---

### 5. Verificar Token

**Endpoint**: `GET /auth/check-token`

Verifica si el token actual es válido.

**Headers**: `Authorization: Bearer <tu_token>`

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "...",
    "tokenExpiresIn": 3600,
    "refreshTokenExpiresIn": 86400
  },
  "msg": "Token válido, sesión activa"
}
```

---

### 6. Actualizar Perfil

**Endpoint**: `PATCH /auth/update-profile`

Actualiza los datos del perfil del usuario autenticado.

**Headers**: `Authorization: Bearer <tu_token>`

**Body (JSON)**:

```json
{
  "name": "Nuevo Nombre",
  "username": "nuevo_username"
}
```

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": null,
  "msg": "Perfil actualizado correctamente"
}
```

---

### 7. Eliminar Cuenta (Perfil)

**Endpoint**: `DELETE /auth/delete-profile`

Elimina la cuenta del usuario autenticado (Soft Delete / Desactivación).

**Headers**: `Authorization: Bearer <tu_token>`

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": null,
  "msg": "Usuario eliminado correctamente"
}
```

---

### 8. Obtener Todos los Usuarios (Admin)

**Endpoint**: `GET /auth`

Obtiene una lista de todos los usuarios registrados.

**Requiere**: `AuthGuard`

**Headers**: `Authorization: Bearer <tu_token>`

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": [
    {
      "id": "...",
      "email": "usuario1@ejemplo.com",
      "name": "Usuario 1"
    }
  ]
}
```

---

### 9. Eliminar Usuario por ID (Admin)

**Endpoint**: `DELETE /auth/delete-user/:id`

Elimina un usuario específico por su ID.

**Requiere**: `AuthGuard`, `RolesGuard`, `Role: ADMIN`

**Headers**: `Authorization: Bearer <tu_token>`

**Parámetros URL**: `id`

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": null,
  "msg": "Usuario eliminado correctamente"
}
```

---

### 10. Actualizar Usuario por Admin

**Endpoint**: `PATCH /auth/users/:id`

Actualiza un usuario específico por su ID (Admin).

**Requiere**: `AuthGuard`, `RolesGuard`, `Role: ADMIN`

**Headers**: `Authorization: Bearer <tu_token>`

**Body (JSON)**:

```json
{
  "email": "user@example.com",
  "name": "New Name",
  "username": "new_username",
  "password": "new_password",
  "isActive": true,
  "role": "ROLE_ADMIN",
  "raceId": 1,
  "permissions": ["novels.create", "novels.read"]
}
```

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": null,
  "msg": "Usuario actualizado correctamente por administrador"
}
```

---

---

## Módulo de Roles (`/roles`)

**Requiere**: `AuthGuard`, `RolesGuard`, `Role: ADMIN` para todos los endpoints.

### 1. Listar Roles

**Endpoint**: `GET /roles`

**Query Params**:

- `criterio`: 'name' | 'isactive'
- `valor`: valor a buscar

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": [ ... ]
}
```

### 2. Crear Rol

**Endpoint**: `POST /roles`

**Body**:

```json
{
  "name": "ROLE_MODERATOR",
  "displayName": "Moderador",
  "description": "Puede gestionar contenido pero no usuarios",
  "permissions": ["novels.edit", "chapters.edit"],
  "isProtected": false,
  "isActive": true
}
```

### 3. Gestionar Rol (Manage)

**Endpoint**: `POST /roles/manage`

**Body**:

```json
{
  "id": "65bf...",
  "name": "ROLE_UPDATED",
  "permissions": ["novels.delete"]
}
```

### 4. Actualizar Rol

**Endpoint**: `PATCH /roles/:id`

**Body**:

```json
{
  "displayName": "Moderador Senior",
  "permissions": ["novels.delete", "users.read"]
}
```

### 5. Eliminar Rol

**Endpoint**: `DELETE /roles/:id`

---

## Módulo de Razas (`/races`)

**Requiere**: `AuthGuard`, `RolesGuard`, `Role: ADMIN` para todos los endpoints.

### 1. Listar Razas

**Endpoint**: `GET /races`

### 2. Obtener Raza

**Endpoint**: `GET /races/:id`

### 3. Crear Raza

**Endpoint**: `POST /races`

**Body**:

```json
{
  "name": "Human",
  "displayName": "Humano",
  "description": "Raza versátil y común",
  "isActive": true
}
```

### 4. Actualizar Raza

**Endpoint**: `PATCH /races/:id`

**Body**:

```json
{
  "displayName": "Humano Mejorado",
  "isActive": false
}
```

### 5. Eliminar Raza

**Endpoint**: `DELETE /races/:id`

---

## Módulo de Novelas (`/novels`)

### 1. Crear Novela

**Endpoint**: `POST /novels`

**Requiere**: `AuthGuard`, `PermissionGuard` ('novels.create')

**Headers**: `Content-Type: application/json`

**Body (JSON)**:

```json
{
  "title": "Mi Novela Increíble",
  "description": "Una historia fascinante...",
  "image": "https://ejemplo.com/imagen.jpg",
  "associatedNames": ["Nombre Alternativo 1"],
  "genre": ["Acción"],
  "tags": ["fantasía"],
  "sourceLanguage": "Español",
  "status": "En progreso"
}
```

**Respuesta exitosa (201)**:

```json
{
  "statusCode": 1,
  "data": {
    "id": "...",
    "title": "Mi Novela Increíble",
    ...
  },
  "msg": "Novel created successfully"
}
```

---

### 2. Listar Novelas

**Endpoint**: `GET /novels`

**Requiere**: `AuthGuard`, `PermissionGuard` ('novels.read')

**Query Params**: `page`, `limit`, `genre`, `status`...

**Respuesta exitosa (200)**:

```json
{
  "statusCode": 1,
  "data": [ ... ]
}
```

---

## Módulo de Géneros (`/genres`)

### 1. Crear Género

**Endpoint**: `POST /genres`

**Requiere**: `AuthGuard`, `PermissionGuard` ('genres.create')

**Body**: `{ "name": "Fantasía", "description": "..." }`

**Respuesta exitosa (201)**:

```json
{
  "statusCode": 1,
  "data": { "id": "...", "name": "Fantasía" },
  "msg": "Genre created successfully"
}
```

### 2. CRUD Género (Otros endpoints)

- `GET /genres` - Listar todos (Permiso: 'genres.read')
- `GET /genres/:id` - Obtener uno (Permiso: 'genres.read')
- `PATCH /genres/:id` - Actualizar (Permiso: 'genres.edit')
- `DELETE /genres/:id` - Eliminar (Permiso: 'genres.delete')

---

## Módulo de Capítulos (`/chapters`)

### 1. Crear Capítulo

**Endpoint**: `POST /chapters`

**Requiere**: `AuthGuard`, `PermissionGuard` ('chapters.create')

**Body**:

```json
{
  "novelId": "id_de_la_novela",
  "chapterNumber": 1,
  "title": "Primer Capítulo",
  "content": "..."
}
```

**Respuesta exitosa (201)**:

```json
{
  "statusCode": 1,
  "data": { ... },
  "msg": "Chapter created successfully"
}
```

### 2. CRUD Capítulos (Otros endpoints)

- `GET /chapters` - Listar todos (Permiso: 'chapters.read')
- `GET /chapters/novel/:novelId` - Listar por Novela (Permiso: 'chapters.read')
- `GET /chapters/:id` - Obtener detalle (Permiso: 'chapters.read')
- `PATCH /chapters/:id` - Actualizar (Permiso: 'chapters.edit')
- `DELETE /chapters/:id` - Eliminar (Permiso: 'chapters.delete')

---

## 🚀 Guía de Uso Completa (Paso a Paso)

Este escenario simula el flujo real administrativo de la plataforma: **Crear Géneros -> Registrarse -> Crear Novela -> Añadir Capítulos**.

### Paso 1: Autenticación Administrativa

Primero necesitamos un usuario para realizar acciones protegidas.

**1. Registrarse:**

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "admin@novelhub.com",
  "password": "SecurePassword123!",
  "name": "Admin User",
  "username": "admin"
}
```

**2. Iniciar Sesión (Obtener Token):**

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@novelhub.com",
  "password": "SecurePassword123!"
}
```

> ⚠️ **COPIA EL TOKEN** que recibas en `data.token`. Lo necesitarás para TODO lo siguiente.

---

### Paso 2: Configuración del Sistema (Géneros)

Antes de crear novelas, necesitamos definir géneros (Acción, Fantasía, Romance...).

**Crear Género "Acción":**

```http
POST http://localhost:3000/genres
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>

{
  "name": "Acción",
  "description": "Novelas con alto contenido de combate y adrenalina",
  "isActive": true
}
```

**Crear Género "Romance":**

```http
POST http://localhost:3000/genres
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>

{
  "name": "Romance",
  "description": "Historias centradas en relaciones amorosas",
  "isActive": true
}
```

---

### Paso 3: Crear Contenido (Novelas)

Ahora creamos la novela vinculándola a los géneros (aunque en este MVP los géneros se envían como strings en el array `genre` por ahora, idealmente usarían IDs).

**Crear Nueva Novela:**

```http
POST http://localhost:3000/novels
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>

{
  "title": "El Señor de los Anillos: La Comunidad",
  "description": "Un hobbit viaja para destruir un anillo.",
  "image": "https://example.com/cover.jpg",
  "genre": ["Acción", "Fantasía"],
  "tags": ["anillos", "viaje", "magia"],
  "sourceLanguage": "Inglés",
  "status": "Completado"
}
```

> ⚠️ **COPIA EL ID DE LA NOVELA** (`data.id`) de la respuesta. Ej: `65bf...`

---

### Paso 4: Añadir Capítulos

Con el `novelId` copiado, añadimos contenido a la novela.

**Crear Capítulo 1:**

```http
POST http://localhost:3000/chapters
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>

{
  "novelId": "<PEGA_AQUI_EL_ID_DE_LA_NOVELA>",
  "chapterNumber": 1,
  "title": "Una Reunión Muy Esperada",
  "content": "<h1>Capítulo 1</h1><p>En un agujero en el suelo, vivía un hobbit...</p>",
  "isPublished": true
}
```

**Crear Capítulo 2:**

```http
POST http://localhost:3000/chapters
Content-Type: application/json
Authorization: Bearer <TU_TOKEN>

{
  "novelId": "<PEGA_AQUI_EL_ID_DE_LA_NOVELA>",
  "chapterNumber": 2,
  "title": "La Sombra del Pasado",
  "content": "<h1>Capítulo 2</h1><p>Gandalf llegó esa tarde...</p>",
  "isPublished": true
}
```

---

### Paso 5: Consultar Contenido (Frontend)

Así es como el frontend mostraría la novela y sus capítulos.

**Ver Detalle de la Novela:**

```http
GET http://localhost:3000/novels?title=El Señor de los Anillos
```

**Ver Capítulos de la Novela:**

```http
GET http://localhost:3000/chapters/novel/<PEGA_AQUI_EL_ID_DE_LA_NOVELA>
```

---

### Paso 6: Fin de Sesión

Al terminar de administrar, cerramos sesión.

**Logout:**

```http
POST http://localhost:3000/auth/logout
Authorization: Bearer <TU_TOKEN>
```

---

## Códigos de Estado HTTP

| Código | Significado                                      |
| ------ | ------------------------------------------------ |
| 200    | OK - La solicitud fue exitosa                    |
| 201    | Created - Recurso creado exitosamente            |
| 400    | Bad Request - Datos inválidos                    |
| 401    | Unauthorized - Token inválido o no proporcionado |
| 404    | Not Found - Recurso no encontrado                |
| 500    | Internal Server Error - Error en el servidor     |
