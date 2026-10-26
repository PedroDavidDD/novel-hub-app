import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeSwitcherComponent } from '../../../core/components';
import { NavbarSearchComponent, NavbarUserMenuComponent } from './components';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { NavigationItem } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    ThemeSwitcherComponent,
    CommonModule,
    NavbarUserMenuComponent,
    NavbarSearchComponent,
    HasPermissionDirective,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // Inputs según convención Dumb Component
  readonly arrLinks = input<NavigationItem[]>([]);
  readonly boNavbarSearch = input<boolean>(false);
  readonly boIsLoggedIn = input<boolean>(true);

  // Outputs para notificar eventos al componente contenedor Smart
  readonly onSearchClick = output<void>();
  readonly onToggleMenu = output<void>();
  readonly onCloseMenu = output<void>();

  // Estado interno presentacional exclusivamente para la UI
  readonly boMenuOpen = signal<boolean>(false);
  readonly openSubmenuId = signal<string | null>(null);

  toggleMenuOpen(): void {
    this.boMenuOpen.update((v) => !v);
    this.onToggleMenu.emit();
  }

  closeMenu(): void {
    this.boMenuOpen.set(false);
    this.openSubmenuId.set(null);
    this.onCloseMenu.emit();
  }

  toggleSubmenu(id: string): void {
    this.openSubmenuId.update((current) => (current === id ? null : id));
  }

  isSubmenuOpen(id: string): boolean {
    return this.openSubmenuId() === id;
  }

  openModal(): void {
    this.onSearchClick.emit();
  }
}
