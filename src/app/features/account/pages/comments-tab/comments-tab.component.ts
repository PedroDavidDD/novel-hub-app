import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CommentMock {
  id: string;
  novelTitle: string;
  chapter: string;
  comment: string;
  likes: number;
  date: string;
}

@Component({
  selector: 'app-comments-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments-tab.component.html',
  styleUrls: ['./comments-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsTabComponent {
  readonly comments: CommentMock[] = [
    {
      id: 'c1',
      novelTitle: 'Shadow Slave',
      chapter: 'Capítulo 118',
      comment: '¡Qué giro tan inesperado! No me esperaba que Sunny tomara esa decisión en este momento.',
      likes: 24,
      date: 'Hace 2 días',
    },
    {
      id: 'c2',
      novelTitle: 'Solo Leveling: Ragnarok',
      chapter: 'Capítulo 42',
      comment: 'El sistema de sombras sigue siendo tan imponente como en la primera parte. Excelente traducción.',
      likes: 15,
      date: 'Hace 5 días',
    },
  ];
}
