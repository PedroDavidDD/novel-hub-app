# Catálogo de Listados y Filtros con Signals — Frontend Angular 19

En NovelHub, los listados de datos principales (como el catálogo de novelas) se implementan mediante **Signals Reactivos** y **Estrategias de Ordenamiento desacopladas**.

---

## 1. Patrón Canónico de Catálogo Filtrable (`NovelsPageComponent`)

- **Ruta de referencia**: `src/app/features/novels/pages/novels-page/novels-page.component.ts`

### A. Estrategias de Ordenamiento Desacopladas (`SORT_STRATEGIES`)
Las funciones de comparación se extraen fuera del componente como constantes tipadas:
```typescript
export type SortOption = 'Name' | 'Popular' | 'Chapters' | 'New' | 'Rating';

const SORT_STRATEGIES: Record<SortOption, (a: INovel, b: INovel) => number> = {
  Name: (a, b) => a.title.localeCompare(b.title),
  Popular: (a, b) => b.popularity - a.popularity,
  Chapters: (a, b) => b.chapters - a.chapters,
  New: (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  Rating: (a, b) => b.rating - a.rating,
};
```

### B. Estado con Signals
```typescript
@Component({
  selector: 'app-novels-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovelsPageComponent {
  private readonly novelsService = inject(NovelsService);

  readonly selectedLanguage = signal<string>('Any');
  readonly selectedStatus = signal<string>('Any');
  readonly selectedSort = signal<SortOption>('Name');
  readonly selectedGenres = signal<string[]>([]);

  // Computed signal que recalcula automáticamente la lista cuando cambia cualquier filtro
  readonly filteredNovels = computed(() => {
    const allNovels = this.novelsService.novels();
    const filtered = allNovels.filter(novel => this.shouldShowNovel(novel));
    return this.sortNovels(filtered);
  });
}
```

---

## 2. Renderizado en Plantilla con Control Flow

```html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  @for (novel of filteredNovels(); track novel.id) {
    <div class="novel-card bg-surface p-4 rounded-lg shadow-medium">
      <img [src]="novel.image" [alt]="novel.title" class="w-full h-48 object-cover rounded" />
      <h3 class="text-lg font-bold mt-2">{{ novel.title | truncate: 35 }}</h3>
      <p class="text-sm text-gray-500">{{ novel.status }} • {{ novel.sourceLanguage }}</p>
    </div>
  } @empty {
    <div class="col-span-full text-center py-12 text-gray-400">
      No se encontraron novelas con los filtros seleccionados.
    </div>
  }
</div>
```

---

## 3. Cuándo Reutilizar Este Patrón

- Utilizar este patrón siempre que se deba implementar un catálogo, listado de usuarios, capítulos o elementos filtrables en el cliente.
