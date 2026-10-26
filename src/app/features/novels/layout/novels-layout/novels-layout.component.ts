import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FooterComponent } from '../../../../shared/layout/footer/footer.component';
import { NavbarComponent } from '../../../../shared/layout/navbar/navbar.component';
import { AsideComponent } from '../../../../shared/layout/aside/aside.component';
import { AdsComponent } from '../../../../ads/ads.component';
import { NavigationFacade } from '../../../../core/services/navigation.facade';
import { NavbarService } from '../../../../shared/layout/navbar/services/navbar.service';

@Component({
  selector: 'novels-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent,
    AsideComponent,
    AdsComponent,
  ],
  templateUrl: './novels-layout.component.html',
  styleUrl: './novels-layout.component.css',
})
export class NovelsLayoutComponent {
  private readonly navigationFacade = inject(NavigationFacade);
  private readonly navbarService = inject(NavbarService);

  readonly navLinks = this.navigationFacade.navTree;
  readonly isNavbarSearch = toSignal(this.navbarService.isNavbarSearch$, { initialValue: false });

  onSearchClick(): void {
    this.navbarService.openModal();
  }
}
