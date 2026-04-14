import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Routing-ის კონფიგურაცია
    provideHttpClient(withInterceptorsFromDi()), // HTTP Client
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }  // Auth Interceptor
  ]
};