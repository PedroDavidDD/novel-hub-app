import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Preservar hash de OAuth antes de que withHashLocation() de Angular lo reemplace
const initialHash = window.location.hash;
if (initialHash && (initialHash.includes('id_token=') || initialHash.includes('access_token='))) {
  sessionStorage.setItem('pending_oauth_hash', initialHash);
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
