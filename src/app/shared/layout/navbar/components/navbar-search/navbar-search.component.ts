import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../../../components';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'navbar-search',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent],
  templateUrl: './navbar-search.component.html',
  styleUrl: './navbar-search.component.css',
})
export class NavbarSearchComponent {
  @Input() public isNavbarSearch: boolean = false;

  constructor(private navbarService: NavbarService) {}

  closeModal() {
    this.navbarService.closeModal();
  }
}
