import { dashText } from './dash.util';

/**
 * Formatea una fecha en formato visual 'dd/mm/aaaa hh:mm:ss' (24 horas sin espacios en la fecha).
 * Retorna '-' si la fecha es nula, indefinida, vacía o inválida.
 * Exclusivo para la capa de presentación visual en templates/UI.
 *
 * @param value Fecha como string, Date, number, null o undefined.
 * @returns Fecha formateada como 'dd/mm/aaaa hh:mm:ss' o '-' si no es válida.
 */
export function formatDateTime(value?: string | number | Date | null): string {
  if (!value) {
    return dashText(null);
  }

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return dashText(null);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
