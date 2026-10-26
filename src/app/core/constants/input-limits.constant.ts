/**
 * Catálogo estandarizado de límites máximos de caracteres para inputs en NovelHub.
 *
 * REGLA DE ORO N° 11:
 * Todo input o textarea debe definir un límite máximo estándar y mostrar el contador
 * de caracteres en tiempo real con formato 'actual / máximo' (ej: '0 / 250').
 *
 * Los límites del cliente son intencionalmente inferiores a los límites de almacenamiento
 * en MongoDB para garantizar un margen de seguridad (buffer) contra desbordamientos.
 */
export const INPUT_LIMITS = {
  /** Textos muy cortos: códigos, slugs, sufijos (Máx: 50 | BD: 100) */
  TEXT_SHORT: 50,

  /** Nombres propios, usernames, títulos de obras/capítulos (Máx: 100 | BD: 150) */
  TEXT_NAME: 100,

  /** Texto estándar: emails, URLs, subtítulos, campos generales (Máx: 250 | BD: 300) */
  TEXT_STANDARD: 250,

  /** Textos medianos: descripciones breves, sinopsis corta, reseñas (Máx: 500 | BD: 1000) */
  TEXT_LONG: 500,

  /** Textos extensos / Textareas: biografía 'About', sinopsis completa (Máx: 1000 | BD: 2000) */
  TEXT_AREA: 1000,

  /** Contenido largo: capítulos de novelas, ensayos extensos (Máx: 50000 | BD: 100000) */
  TEXT_CONTENT: 50000,

  /** Números enteros estándar: edades, capítulos, órdenes (Máx dígitos: 10) */
  NUMBER_STANDARD: 10,
} as const;

export type InputLimitCategory = keyof typeof INPUT_LIMITS;
