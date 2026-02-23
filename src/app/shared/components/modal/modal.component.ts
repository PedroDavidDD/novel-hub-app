import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarService } from '../../layout/navbar/services/navbar.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() title: string = 'Título del Modal';
  @Input() show: boolean = false;

  public isNavbarSearch: boolean = false;
  private destroyRef = inject(DestroyRef);

  constructor(private navbarService: NavbarService) {
    navbarService.isNavbarSearch$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((state) => {
      this.isNavbarSearch = state;
    });
  }

  closeModal() {
    this.navbarService.closeModal();
  }
}
