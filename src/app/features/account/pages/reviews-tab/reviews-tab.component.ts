import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReviewMock {
  id: string;
  novelTitle: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

@Component({
  selector: 'app-reviews-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-tab.component.html',
  styleUrls: ['./reviews-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsTabComponent {
  readonly reviews: ReviewMock[] = [
    {
      id: 'r1',
      novelTitle: 'Shadow Slave',
      rating: 5,
      title: 'Una obra maestra de la fantasía oscura moderna',
      body: 'La construcción del mundo, la complejidad de Sunny como protagonista y la tensión psicológica en cada desafío hacen que esta novela sea absolutamente imperdible.',
      date: '15 de Septiembre, 2025',
    },
    {
      id: 'r2',
      novelTitle: 'Lord of the Mysteries',
      rating: 5,
      title: 'El estándar de oro del misterio steampunk',
      body: 'Un sistema de magia impecable, conspiraciones que se sienten vivas y un protagonista inolvidable.',
      date: '28 de Agosto, 2025',
    },
  ];
}
