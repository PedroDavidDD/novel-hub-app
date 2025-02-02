import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { INovel, NovelsService } from '../../services/novels.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  novels$: Observable<INovel[]> = of([]);

  constructor(private novelsService: NovelsService) {
    this.refreshNovels();
  }
  
  private refreshNovels(): void {
    this.novels$ = this.novelsService.getNovels().pipe(
      map(novels => this.applyFilters(novels))
    );
  }
  
  private applyFilters(novels: INovel[]): INovel[] {
    let filteredNovels = novels.filter(novel => {
      return novel;
    });

    return filteredNovels;
  }
}
