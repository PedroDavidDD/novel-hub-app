import { Injectable, inject, signal } from '@angular/core';
import { NavigationService } from './navigation.service';
import { NavigationItem } from '../models/navigation.model';

@Injectable({ providedIn: 'root' })
export class NavigationFacade {
  private readonly navigationService = inject(NavigationService);

  // Estado reactivo con Signals de Angular 19
  readonly navTree = signal<NavigationItem[]>([]);
  readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this.isLoading.set(true);
    this.navigationService.getNavigationTree().subscribe({
      next: (items) => {
        this.navTree.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  refresh(): void {
    this.loadNavigation();
  }
}
