import { formatDateTime } from './date.util';

describe('formatDateTime utility', () => {
  it('debe retornar "-" para valores nulos, indefinidos o vacíos', () => {
    expect(formatDateTime(null)).toBe('-');
    expect(formatDateTime(undefined)).toBe('-');
    expect(formatDateTime('')).toBe('-');
  });

  it('debe retornar "-" para cadenas que no representan una fecha válida', () => {
    expect(formatDateTime('fecha-invalida')).toBe('-');
    expect(formatDateTime('abc123')).toBe('-');
  });

  it('debe formatear correctamente una fecha en formato "dd/mm/aaaa hh:mm:ss"', () => {
    // 25 de Octubre de 2026, 23:09:03
    const date = new Date(2026, 9, 25, 23, 9, 3);
    expect(formatDateTime(date)).toBe('25/10/2026 23:09:03');
  });

  it('debe rellenar con ceros a la izquierda para días, meses, horas, minutos y segundos menores a 10', () => {
    // 5 de Mayo de 2026, 04:08:07
    const date = new Date(2026, 4, 5, 4, 8, 7);
    expect(formatDateTime(date)).toBe('05/05/2026 04:08:07');
  });

  it('debe admitir formato ISO string', () => {
    const iso = '2026-10-25T23:09:03.309Z';
    const result = formatDateTime(iso);
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
  });
});
