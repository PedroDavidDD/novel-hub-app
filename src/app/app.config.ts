import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    // provideRouter(routes),
    provideRouter(routes, withHashLocation()), // Aquí se habilita el uso de hash
    provideHttpClient(),    
    // { provide: LocationStrategy, useClass: HashLocationStrategy } // useHash
  ]
};
