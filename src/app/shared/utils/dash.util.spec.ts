import { dashText, dashNumber } from './dash.util';

describe('Dash Utils', () => {
  describe('dashText', () => {
    it('debe retornar "-" si el valor es null', () => {
      expect(dashText(null)).toBe('-');
    });

    it('debe retornar "-" si el valor es undefined', () => {
      expect(dashText(undefined)).toBe('-');
    });

    it('debe retornar "-" si el valor es una cadena vacía', () => {
      expect(dashText('')).toBe('-');
    });

    it('debe retornar "-" si el valor contiene solo espacios en blanco', () => {
      expect(dashText('   ')).toBe('-');
    });

    it('debe retornar el texto recortado si es válido', () => {
      expect(dashText('  Novels Hub  ')).toBe('Novels Hub');
    });
  });

  describe('dashNumber', () => {
    it('debe retornar "-" si el valor es null o undefined', () => {
      expect(dashNumber(null)).toBe('-');
      expect(dashNumber(undefined)).toBe('-');
    });

    it('debe retornar "-" si el valor es NaN o string no numérico', () => {
      expect(dashNumber(NaN)).toBe('-');
      expect(dashNumber('abc')).toBe('-');
    });

    it('debe retornar "-" si el valor es string vacío', () => {
      expect(dashNumber('')).toBe('-');
    });

    it('debe retornar el número formateado si es 0', () => {
      expect(dashNumber(0)).toBe('0');
    });

    it('debe retornar el número formateado si es positivo o negativo', () => {
      expect(dashNumber(42)).toBe('42');
      expect(dashNumber(-5)).toBe('-5');
      expect(dashNumber('128')).toBe('128');
    });
  });
});
