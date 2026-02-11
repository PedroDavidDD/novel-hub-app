import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { INovel, NovelsService } from '../../services/novels.service';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { SortOption } from '../../interfaces/novel.interface';

const ANY_FILTER = 'Any';

// Estrategias de ordenamiento extraídas para limpiar la lógica del componente
const SORT_STRATEGIES: Record<SortOption, (a: INovel, b: INovel) => number> = {
  Name: (a, b) => a.title.localeCompare(b.title),
  Popular: (a, b) => b.popularity - a.popularity,
  Chapters: (a, b) => b.chapters - a.chapters,
  New: (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  Rating: (a, b) => b.rating - a.rating,
};

@Component({
  selector: 'app-novels-page',
  standalone: true,
  imports: [TruncatePipe],
  templateUrl: './novels-page.component.html',
  styleUrls: ['./novels-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovelsPageComponent {
  private readonly novelsService = inject(NovelsService);

  // --- CONFIGURACIÓN ESTÁTICA ---
  readonly languages: string[] = ['Any', 'Chinese', 'Korean'];
  readonly statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  readonly sortByOptions: SortOption[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];
  readonly genres: string[] = ['Drama', 'Non-Fiction', 'Fantasy', 'Sci-Fi', 'Romance', 'Adventure', 'Action'];

  // --- ESTADO REACTIVO (SIGNALS) ---
  // Usamos signals para que Angular sepa exactamente qué cambió y cuándo.
  readonly selectedLanguage = signal<string>(ANY_FILTER);
  readonly selectedStatus = signal<string>(ANY_FILTER);
  readonly selectedSort = signal<SortOption>('Name');
  readonly selectedGenres = signal<string[]>([]);

  // --- ESTADO COMPUTADO (LA "MAGIA") ---
  // Este signal se actualiza AUTOMÁTICAMENTE cuando cambia cualquiera de
  // los signals que usa dentro (novels, language, status, sort, genres).
  readonly filteredNovels = computed(() => {
    // 1. Obtener datos actuales
    const allNovels = this.novelsService.novels();
    
    // 2. Aplicar filtros
    const filtered = allNovels.filter(novel => this.shouldShowNovel(novel));
    
    // 3. Aplicar ordenamiento
    return this.sortNovels(filtered);
  });

  // --- ACCIONES DE UI ---
  
  filterByLanguage(language: string): void {
    this.selectedLanguage.set(language);
  }

  filterByStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  sortBy(option: SortOption): void {
    this.selectedSort.set(option);
  }

  onGenreChange(genre: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.selectedGenres.update(currentGenres => {
      // Si se marcó el checkbox, agregamos el género. Si no, lo quitamos.
      if (isChecked) {
        return [...currentGenres, genre];
      } else {
        return currentGenres.filter(g => g !== genre);
      }
    });
  }

  /**
   * Determina si una novela cumple con TODOS los filtros seleccionados.
   */
  private shouldShowNovel(novel: INovel): boolean {
    // 1. Filtro de Idioma
    const matchesLanguage = 
      this.selectedLanguage() === ANY_FILTER || 
      novel.language === this.selectedLanguage();

    // 2. Filtro de Estado
    const matchesStatus = 
      this.selectedStatus() === ANY_FILTER || 
      novel.status === this.selectedStatus();

    // 3. Filtro de Géneros (La novela debe tener TODOS los géneros seleccionados)
    const currentGenres = this.selectedGenres();
    const matchesGenres = 
      currentGenres.length === 0 || 
      currentGenres.every(genre => novel.genres.includes(genre));

    return matchesLanguage && matchesStatus && matchesGenres;
  }

  /**
   * Ordena las novelas según la opción seleccionada sin mutar el array original.
   */
  private sortNovels(novels: INovel[]): INovel[] {
    const sortStrategy = SORT_STRATEGIES[this.selectedSort()];
    
    // Usamos [...novels] para crear una copia y NO modificar el array original al ordenar
    return sortStrategy ? [...novels].sort(sortStrategy) : novels;
  }
}
