import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../../../shared/layout/footer/footer.component";
import { NavbarComponent } from "../../../../shared/layout/navbar/navbar.component";
import { AsideComponent } from '../../../../shared/layout/aside/aside.component';
import { AdsComponent } from '../../../../ads/ads.component';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [
    RouterOutlet, 
    FooterComponent, 
    NavbarComponent,
    AsideComponent,
    AdsComponent,
  ],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css',
})
export class LayoutPageComponent {

}
