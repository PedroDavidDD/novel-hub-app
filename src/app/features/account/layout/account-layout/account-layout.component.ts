import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { NavigationFacade } from '../../../../core/services/navigation.facade';
import { NavbarService } from '../../../../shared/layout/navbar/services/navbar.service';
import { NavbarComponent } from '../../../../shared/layout/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/layout/footer/footer.component';
import { CustomBadgeComponent } from '../../../../shared/components/custom-badge/custom-badge.component';
import { dashText } from '../../../../shared/utils/dash.util';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    FooterComponent,
    CustomBadgeComponent,
  ],
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly navigationFacade = inject(NavigationFacade);
  private readonly navbarService = inject(NavbarService);

  readonly user = this.authService.user;
  readonly navLinks = this.navigationFacade.navTree;
  readonly isNavbarSearch = toSignal(this.navbarService.isNavbarSearch$, { initialValue: false });

  formatDash(value?: string | null): string {
    return dashText(value);
  }

  onSearchClick(): void {
    this.navbarService.openModal();
  }
}
