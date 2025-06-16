import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { UserService } from './core/services/user.service';

const appInicializerProvider = (UserService: UserService) => {
  return () => {
    UserService.onTrySyncUserInfo();
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => {
      const initializerFn = appInicializerProvider(inject(UserService));
      return initializerFn();
    }),
  ],
};
