import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { INovel, NovelsService } from '../../services/novels.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-novels-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novels-page.component.html',
  styleUrls: ['./novels-page.component.css'],
})
export class NovelsPageComponent {
  languages: string[] = ['Any', 'Chinese', 'Korean'];
  statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  sortByOptions: string[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];
  genres: string[] = ['Drama', 'Non-Fiction', 'Fantasy', 'Sci-Fi', 'Romance', 'Adventure', 'Action'];

  selectedLanguage: string = 'Any';
  selectedStatus: string = 'Any';
  selectedSort: string = 'Name';
  selectedGenres: string[] = [];  // Array para géneros seleccionados

  novels$: Observable<INovel[]> = of([]);

  constructor(private novelsService: NovelsService) {
    this.refreshNovels();
  }

  filterByLanguage(language: string): void {
    this.selectedLanguage = language;
    this.refreshNovels();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.refreshNovels();
  }

  sortBy(option: string): void {
    this.selectedSort = option;
    this.refreshNovels();
  }

  filterByGenres(): void {
    this.refreshNovels();
  }

  private refreshNovels(): void {
    this.novels$ = this.novelsService.getNovels().pipe(
      map(novels => this.applyFilters(novels))
    );
  }

  onGenreChange(genre: string, event: any): void {
    if (event.target.checked) {
      // Si el checkbox está marcado, añadir el género al array
      this.selectedGenres.push(genre);
    } else {
      // Si el checkbox está desmarcado, eliminar el género del array
      this.selectedGenres = this.selectedGenres.filter(item => item !== genre);
    }
    this.refreshNovels();
  }

  private applyFilters(novels: INovel[]): INovel[] {
    let filteredNovels = novels.filter(novel => {
      const languageMatch = this.selectedLanguage === 'Any' || novel.language === this.selectedLanguage;
      const statusMatch = this.selectedStatus === 'Any' || novel.status === this.selectedStatus;

      // Filtra según los géneros seleccionados
      const genreMatch = this.selectedGenres.length === 0 || 
      this.selectedGenres.every(genre => novel.genres.includes(genre));

      return languageMatch && statusMatch && genreMatch;
    });

    const sortFunctions: { [key: string]: (a: INovel, b: INovel) => number } = {
      'Name': (a, b) => a.title.localeCompare(b.title),
      'Popular': (a, b) => b.popularity - a.popularity,
      'Chapters': (a, b) => b.chapters - a.chapters,
      'New': (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      'Rating': (a, b) => b.rating - a.rating
    };

    if (this.selectedSort && sortFunctions[this.selectedSort]) {
      filteredNovels.sort(sortFunctions[this.selectedSort]);
    }

    return filteredNovels;
  }
}
