import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter(routes),
    provideRouter(routes, withHashLocation()), // Aquí se habilita el uso de hash
    provideHttpClient(withFetch()),
    provideAnimations(), // Required for Toast animations and other Angular animations (replaces BrowserAnimationsModule)
    // { provide: LocationStrategy, useClass: HashLocationStrategy } // useHash
  ]
};
