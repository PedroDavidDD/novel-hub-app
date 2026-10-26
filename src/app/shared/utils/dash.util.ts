/**
 * Utilidades para sanitización y presentación de datos vacíos, nulos o no definidos.
 * Sustituye cualquier valor ausente por un guión '-' según las reglas de diseño.
 */

/**
 * Evalúa y formatea texto. Si el valor es null, undefined o una cadena vacía/espacios, retorna '-'.
 * @param value Cadena a formatear
 * @returns Cadena limpia o '-'
 */
export function dashText(value?: string | null): string {
  if (value === null || value === undefined) {
    return '-';
  }
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : '-';
}

/**
 * Evalúa y formatea números. Si el valor es null, undefined, NaN o no numérico, retorna '-'.
 * @param value Número a formatear
 * @returns Cadena con el número o '-'
 */
export function dashNumber(value?: number | string | null): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  return String(num);
}
