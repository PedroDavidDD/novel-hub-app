/**
 * Utilidades para sanitización y presentación de datos vacíos, nulos o no definidos.
 * Sustituye cualquier valor ausente por un guión '-' según las reglas de diseño.
 * 
 * ⚠️ REGLA ARQUITECTÓNICA ESTRICTA:
 * - Uso EXCLUSIVO en la capa de presentación visual (UI/Templates/Vistas del Frontend).
 * - PROHIBIDO su uso en la construcción de payloads de envío hacia el backend (POST/PUT/PATCH).
 * - En mutaciones hacia la API, los valores ausentes deben enviarse como null, undefined o ser omitidos.
 */

/**
 * Evalúa y formatea texto para la UI. Si el valor es null, undefined o una cadena vacía/espacios, retorna '-'.
 * @param value Cadena a formatear para renderizado en pantalla
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
 * Evalúa y formatea números para la UI. Si el valor es null, undefined, NaN o no numérico, retorna '-'.
 * @param value Número a formatear para renderizado en pantalla
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
