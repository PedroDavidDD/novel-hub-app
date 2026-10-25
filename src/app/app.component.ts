import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { GoogleAuthService } from './features/auth/services/social/google-auth.service';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'novel-hub-app';
  private googleAuth = inject(GoogleAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    const hash = window.location.hash;

    if (hash && (hash.includes('access_token') || hash.includes('id_token'))) {
      try {
        const result = await this.googleAuth.handleAuthCallback();

        if (result.success && result.user) {
          this.authService.loginWithSocial('google').subscribe({
            next: (authResult) => {
              if (authResult.success) {
                const callbackUrl = sessionStorage.getItem('oauth_callback_url');
                sessionStorage.removeItem('oauth_callback_url');
                sessionStorage.removeItem('oauth_provider');

                if (callbackUrl && callbackUrl !== window.location.href) {
                  window.location.href = callbackUrl;
                } else {
                  this.router.navigate(['/home']);
                }
              }
            },
            error: () => {
              this.router.navigate(['/auth/login']);
            }
          });
        } else {
          this.router.navigate(['/auth/login']);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        this.router.navigate(['/auth/login']);
      }
    }
  }
}
