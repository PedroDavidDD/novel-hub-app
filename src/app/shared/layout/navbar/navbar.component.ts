import { Component, ViewEncapsulation, inject, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../core/components';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarSearchComponent, NavbarUserMenuComponent } from './components';
import { NavbarService } from './services/navbar.service';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

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
})
export class NavbarComponent {
  public isLoggedIn: boolean = false;

  public isMenuOpen: boolean = false;

  public isNavbarSearch: boolean = false;
  private destroyRef = inject(DestroyRef);

  constructor(private navbarService: NavbarService) {
    navbarService.isNavbarSearch$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((state) => {
      this.isNavbarSearch = state;
    });
  }

  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal() {
    this.navbarService.openModal();
  }
}
