import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';

interface HistoryItemMock {
  id: string;
  novelTitle: string;
  chapterTitle: string;
  chapterNumber: number;
  readAt: string;
  cover: string;
}

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTabComponent {
  readonly history: HistoryItemMock[] = [
    {
      id: 'h1',
      novelTitle: 'Shadow Slave',
      chapterTitle: 'Capítulo 120: El Río de las Almas',
      chapterNumber: 120,
      readAt: 'Hace 45 minutos',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 'h2',
      novelTitle: 'Solo Leveling: Ragnarok',
      chapterTitle: 'Capítulo 45: La Puerta Carmesí',
      chapterNumber: 45,
      readAt: 'Hace 3 horas',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 'h3',
      novelTitle: 'Dune',
      chapterTitle: 'Capítulo 12: Arrakis al Anochecer',
      chapterNumber: 12,
      readAt: 'Ayer',
      cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=200&auto=format&fit=crop',
    },
  ];
}
