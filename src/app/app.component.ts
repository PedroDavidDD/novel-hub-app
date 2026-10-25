import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/services/toast.service';
import { GoogleAuthService } from './features/auth/services/social/google-auth.service';
import { AuthService } from './features/auth/services/auth.service';
import { SocialAuthResponse } from './features/auth/interfaces/social/social-auth.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'novel-hub-app';
  private readonly googleAuth = inject(GoogleAuthService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  async ngOnInit(): Promise<void> {
    await this.handleOAuthRedirectCallback();
  }

  /**
   * Captura el hash de OAuth tras el redirect del proveedor y conecta la sesión
   */
  private async handleOAuthRedirectCallback(): Promise<void> {
    const pendingHash = sessionStorage.getItem('pending_oauth_hash');
    const hash = (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('id_token')))
      ? window.location.hash
      : (pendingHash || '');

    if (!hash || (!hash.includes('access_token') && !hash.includes('id_token'))) {
      return;
    }

    // Si el router reemplazó el hash, restauramos temporalmente el hash de OAuth para que la librería lo lea
    if (pendingHash && !window.location.hash.includes('id_token=')) {
      window.location.hash = pendingHash;
    }

    try {
      const result = await this.googleAuth.handleAuthCallback();

      if (result.success && result.user) {
        this.processSocialAuthCallback(result);
      } else {
        this.handleAuthCallbackFailure(result.error || 'Autenticación con Google fallida');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      this.handleAuthCallbackFailure('Ocurrió un error inesperado al procesar la autenticación');
    } finally {
      sessionStorage.removeItem('pending_oauth_hash');
    }
  }

  /**
   * Conecta los datos verificados del proveedor con el backend de NovelHub
   */
  private processSocialAuthCallback(result: SocialAuthResponse): void {
    this.authService.authenticateSocialUser(result.user, result.idToken).subscribe({
      next: (authResult) => {
        if (authResult.success) {
          this.toastService.showSuccess('Bienvenido a NovelHub', 4000, 'Inicio de Sesión Exitoso');
          this.navigateToTarget();
        } else {
          this.handleAuthCallbackFailure(authResult.error || 'No se pudo registrar la sesión');
        }
      },
      error: (error) => {
        this.handleAuthCallbackFailure(error?.message || 'Error de conexión con el servidor');
      }
    });
  }

  /**
   * Redirige a la URL objetivo tras autenticación exitosa limpiando datos temporales
   */
  private navigateToTarget(): void {
    const callbackUrl = sessionStorage.getItem('oauth_callback_url');
    sessionStorage.removeItem('oauth_callback_url');
    sessionStorage.removeItem('oauth_provider');

    // Limpia el hash con los tokens de Google de la barra de direcciones
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (callbackUrl && !callbackUrl.includes('/auth/') && callbackUrl !== window.location.href) {
      window.location.href = callbackUrl;
    } else {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Maneja los fallos durante el callback OAuth
   */
  private handleAuthCallbackFailure(errorMessage: string): void {
    sessionStorage.removeItem('oauth_callback_url');
    sessionStorage.removeItem('oauth_provider');
    
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    this.toastService.showError(errorMessage, 5000, 'Error de Autenticación');
    this.router.navigate(['/auth/login']);
  }
}
