import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {

}
