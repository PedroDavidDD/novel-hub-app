import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, Observable, of, startWith, take } from 'rxjs';
import { INovel, NovelsService } from '../../services/novels.service';
import { NovelLatestHomeComponent } from "../home/novel-latest-home/novel-latest-home.component";
import { NovelPopularHomeComponent } from "../home/novel-popular-home/novel-popular-home.component";

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
      map(novels => this.applyLatestFilter(novels)),
    );
    this.latestNovels = this.latestNovels$
    this.popularNovels$ = this.novelsService.getNovels().pipe(
      map(novels => this.applyPopularFilter(novels)),
      take(3),
    );
    this.popularNovels = this.popularNovels$

  }
  
  private applyLatestFilter(novels: INovel[]): INovel[] {
    return novels.filter(novel => novel.releaseDate);
  }

  private applyPopularFilter(novels: INovel[]): INovel[] {
    return novels.sort((a, b) => a.popularity - b.popularity);
  }
  
}
