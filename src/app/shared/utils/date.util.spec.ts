import { formatDateOnly, formatDateTime } from './date.util';

describe('formatDateTime utility', () => {
  it('debe retornar "-" para valores nulos o indefinidos', () => {
    expect(formatDateTime(null)).toBe('-');
    expect(formatDateTime(undefined)).toBe('-');
    expect(formatDateTime('')).toBe('-');
  });

  it('debe retornar "-" para cadenas con formato de fecha inválido', () => {
    expect(formatDateTime('fecha-invalida')).toBe('-');
    expect(formatDateTime('abc123')).toBe('-');
  });

  it('debe formatear una fecha válida de tipo Date con ceros a la izquierda', () => {
    const date = new Date(2026, 9, 25, 23, 9, 3);
    expect(formatDateTime(date)).toBe('25/10/2026 23:09:03');
  });

  it('debe formatear correctamente una fecha con día y mes de un solo dígito', () => {
    const date = new Date(2026, 4, 5, 4, 8, 7);
    expect(formatDateTime(date)).toBe('05/05/2026 04:08:07');
  });

  it('debe procesar cadenas ISO válidas', () => {
    const iso = '2026-10-25T15:30:00Z';
    const result = formatDateTime(iso);
    expect(result).not.toBe('-');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
  });
});

describe('formatDateOnly utility', () => {
  it('debe retornar "-" para valores nulos, indefinidos o vacíos', () => {
    expect(formatDateOnly(null)).toBe('-');
    expect(formatDateOnly(undefined)).toBe('-');
    expect(formatDateOnly('')).toBe('-');
  });

  it('debe retornar "-" para cadenas inválidas', () => {
    expect(formatDateOnly('no-valida')).toBe('-');
  });

  it('debe formatear como dd/mm/aaaa', () => {
    const date = new Date(2026, 9, 25);
    expect(formatDateOnly(date)).toBe('25/10/2026');
  });

  it('debe agregar padding con cero a día y mes menores a 10', () => {
    const date = new Date(2026, 4, 5);
    expect(formatDateOnly(date)).toBe('05/05/2026');
  });
});
