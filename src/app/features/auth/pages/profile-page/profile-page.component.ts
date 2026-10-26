import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-page.component.html',
  styles: []
})
export class ProfilePageComponent {
  private authService = inject(AuthService);

  public user = this.authService.user;
}
