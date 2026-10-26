import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBadgeComponent } from '../../../../shared/components/custom-badge/custom-badge.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';

interface LibraryNovelMock {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: 'Leyendo' | 'Completado' | 'Pendiente';
  progress: string;
  lastChapter: string;
}

@Component({
  selector: 'app-library-tab',
  standalone: true,
  imports: [CommonModule, CustomBadgeComponent, CustomButtonComponent],
  templateUrl: './library-tab.component.html',
  styleUrls: ['./library-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryTabComponent {
  readonly novels: LibraryNovelMock[] = [
    {
      id: '1',
      title: 'Solo Leveling: Ragnarok',
      author: 'Chugong',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
      status: 'Leyendo',
      progress: 'Cap. 45 / 210',
      lastChapter: 'Capítulo 45: La Puerta Carmesí',
    },
    {
      id: '2',
      title: 'Shadow Slave',
      author: 'Guiltythree',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
      status: 'Leyendo',
      progress: 'Cap. 120 / 1400',
      lastChapter: 'Capítulo 120: El Río de las Almas',
    },
    {
      id: '3',
      title: 'Omniscient Reader’s Viewpoint',
      author: 'Sing-Shong',
      cover: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop',
      status: 'Completado',
      progress: 'Cap. 551 / 551',
      lastChapter: 'Epílogo: La Historia Eterna',
    },
    {
      id: '4',
      title: 'Lord of the Mysteries',
      author: 'Cuttlefish That Loves Diving',
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?q=80&w=400&auto=format&fit=crop',
      status: 'Pendiente',
      progress: 'Cap. 0 / 1432',
      lastChapter: 'Capítulo 1: El Despertar',
    },
  ];
}
