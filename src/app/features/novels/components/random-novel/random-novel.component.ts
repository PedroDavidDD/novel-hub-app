import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NovelsService } from '../../services/novels.service';
import { CustomButtonComponent } from '../../../../shared/components';

@Component({
  selector: 'app-random-novel',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './random-novel.component.html',
  styleUrls: ['./random-novel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomNovelComponent {
  private readonly router = inject(Router);
  private readonly novelsService = inject(NovelsService);

  get label(): string {
    return 'Random Novel';
  }

  onClick(): void {
    this.novelsService.getRandomNovel().subscribe({
      next: (novel) => {
        if (novel && novel.title) {
          this.router.navigate(['/novels', novel.title]);
        }
      }
    });
  }
}
