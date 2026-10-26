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
    expect(domain.title).toBe('Home');
    expect(domain.path).toBe('/');
    expect(domain.children.length).toBe(1);
    expect(domain.children[0].label).toBe('-');
    expect(domain.children[0].title).toBe('-');
    expect(domain.children[0].path).toBe('/sub-home');
  });

  it('debe mapear title explícito cuando esté presente tanto en padre como en hijos', () => {
    const raw = {
      _id: 'nav-2',
      label: 'Novelas',
      title: 'Explorar el catálogo de novelas ligeras',
      path: '/novels',
      children: [
        {
          _id: 'child-2',
          label: 'Populares',
          title: 'Ver las novelas más leídas',
          path: '/novels/popular',
        },
      ],
    };

    const domain = NavigationAdapter.toDomain(raw);
    expect(domain.label).toBe('Novelas');
    expect(domain.title).toBe('Explorar el catálogo de novelas ligeras');
    expect(domain.children[0].label).toBe('Populares');
    expect(domain.children[0].title).toBe('Ver las novelas más leídas');
  });

  it('debe aplicar dashText cuando el label padre sea vacío', () => {
    const raw = {
      label: '   ',
      path: '/novels',
      children: [],
    };

    const domain = NavigationAdapter.toDomain(raw);
    expect(domain.label).toBe('-');
    expect(domain.title).toBe('-');
  });

  it('debe manejar listas de ítems correctamente', () => {
    const rawList = [
      { label: 'Novels', path: '/novels' },
      { label: 'Genres', path: '/genres' },
    ];

    const list = NavigationAdapter.toDomainList(rawList);
    expect(list.length).toBe(2);
    expect(list[0].label).toBe('Novels');
    expect(list[0].title).toBe('Novels');
    expect(list[1].label).toBe('Genres');
    expect(list[1].title).toBe('Genres');
  });

  it('debe retornar arreglo vacío si la entrada no es un arreglo', () => {
    expect(NavigationAdapter.toDomainList(null as any)).toEqual([]);
    expect(NavigationAdapter.toDomainList(undefined as any)).toEqual([]);
  });
});
