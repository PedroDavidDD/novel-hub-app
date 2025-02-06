import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { INovel, NovelsService } from '../../services/novels.service';
import { NovelLatestHomeComponent } from './components/novel-latest-home/novel-latest-home.component';
import { NovelPopularHomeComponent } from './components/novel-popular-home/novel-popular-home.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NovelLatestHomeComponent, 
    NovelPopularHomeComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  latestNovels$: Observable<INovel[]> = of([]);
  popularNovels$: Observable<INovel[]> = of([]);
  
  latestNovels: Observable<INovel[]> = of([]);
  popularNovels: Observable<INovel[]> = of([]);

  constructor(private novelsService: NovelsService) {
    this.refreshNovels();
  }
  
  private refreshNovels(): void {
    this.latestNovels$ = this.novelsService.getNovels().pipe(
      map(novels => this.applyLatestFilter(novels).slice(0, 12)),
    );
  
    this.latestNovels = this.latestNovels$;
  
    this.popularNovels$ = this.novelsService.getNovels().pipe(
      map(novels => this.applyPopularFilter(novels).slice(0, 6)),
    );
  
    this.popularNovels = this.popularNovels$;
  }
  
  
  private applyLatestFilter(novels: INovel[]): INovel[] {
    return novels
      .filter(novel => novel.releaseDate)
      .sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return dateB.getTime() - dateA.getTime();
      });
  }

  private applyPopularFilter(novels: INovel[]): INovel[] {
    return novels.sort((a, b) => b.popularity - a.popularity);
  }
  
}