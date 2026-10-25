# Backend Agent — Coordinación de APIs para Frontend

Este agente asiste en la conexión entre los servicios del frontend y los endpoints del backend NestJS.

## Responsabilidades
- Validar contratos de endpoints en `http://localhost:3000`.
- Garantizar que los DTOs de respuesta sean procesados mediante adapters hacia modelos de dominio.
- Verificar que las peticiones HTTP viajen con el formato `ApiResponse<T>` y manejo seguro de errores.
