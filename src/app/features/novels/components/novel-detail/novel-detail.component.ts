import { ChangeDetectionStrategy, Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Novel } from '../../interfaces/novel.interface';
import { NovelsService } from '../../services/novels.service';

@Component({
  selector: 'app-novel-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novel-detail.component.html',
  styleUrls: ['./novel-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelDetailComponent {
  novel = input.required<Novel>();
  novelId = input.required<string>();

  private readonly router = inject(Router);
  private readonly novelsService = inject(NovelsService);

  // Computed signals para acceso en template
  title = computed(() => this.novel().title);
  image = computed(() => this.novel().image);
  description = computed(() => this.novel().description);
  genres = computed(() => this.novel().genres || []);
  tags = computed(() => this.novel().tags || []);

  onClick(): void {
    this.router.navigate(['/novels', this.novelId()]);
  }
}