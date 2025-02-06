import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../core/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ThemeSwitcherComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {

}
