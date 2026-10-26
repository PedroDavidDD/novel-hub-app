import { NavigationAdapter } from './navigation.adapter';

describe('NavigationAdapter', () => {
  it('debe mapear un ítem raw al modelo de dominio y aplicar dashText en label', () => {
    const raw = {
      _id: 'nav-1',
      label: 'Home',
      path: '/',
      order: 1,
      children: [
        {
          _id: 'child-1',
          label: null, // Debería convertirse en '-'
          path: '/sub-home',
        },
      ],
    };

    const domain = NavigationAdapter.toDomain(raw);

    expect(domain.id).toBe('nav-1');
    expect(domain.label).toBe('Home');
    expect(domain.path).toBe('/');
    expect(domain.children.length).toBe(1);
    expect(domain.children[0].label).toBe('-');
    expect(domain.children[0].path).toBe('/sub-home');
  });

  it('debe aplicar dashText cuando el label padre sea vacío', () => {
    const raw = {
      label: '   ',
      path: '/novels',
      children: [],
    };

    const domain = NavigationAdapter.toDomain(raw);
    expect(domain.label).toBe('-');
  });

  it('debe manejar listas de ítems correctamente', () => {
    const rawList = [
      { label: 'Novels', path: '/novels' },
      { label: 'Genres', path: '/genres' },
    ];

    const list = NavigationAdapter.toDomainList(rawList);
    expect(list.length).toBe(2);
    expect(list[0].label).toBe('Novels');
    expect(list[1].label).toBe('Genres');
  });

  it('debe retornar arreglo vacío si la entrada no es un arreglo', () => {
    expect(NavigationAdapter.toDomainList(null as any)).toEqual([]);
    expect(NavigationAdapter.toDomainList(undefined as any)).toEqual([]);
  });
});
