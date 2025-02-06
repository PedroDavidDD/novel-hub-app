import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../../../shared/layout/footer/footer.component";
import { NavbarComponent } from "../../../../shared/layout/navbar/navbar.component";

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css',
})
export class LayoutPageComponent {

}
