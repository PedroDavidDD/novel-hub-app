import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { INovel, NovelsService } from '../../services/novels.service';

@Component({
  selector: 'app-novels-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novels-page.component.html',
  styleUrl: './novels-page.component.css',
})
export class NovelsPageComponent {
  languages: string[] = ['Any', 'Chinese', 'Korean'];
  statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  sortByOptions: string[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];

  selectedLanguage: string = 'Any';
  selectedStatus: string = 'Any';
  selectedSort: string = 'Name';

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

  private refreshNovels(): void {
    this.novels$ = this.novelsService.getNovels().pipe(
      map(novels => this.applyFilters(novels))
    );
  }

  private applyFilters(novels: INovel[]): INovel[] {
    console.log(novels)
    let filteredNovels = novels.filter(novel => {
      const languageMatch = this.selectedLanguage === 'Any' || novel.language === this.selectedLanguage;
      const statusMatch = this.selectedStatus === 'Any' || novel.status === this.selectedStatus;
      return languageMatch && statusMatch;
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
