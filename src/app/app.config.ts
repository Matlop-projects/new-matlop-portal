import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/basic-auth.interceptor';
import { errorInterceptor } from './core/error.interceptor';
import { spinnerInterceptor } from './core/spinner.interceptor';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToasterService } from './services/toaster.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastrModule } from 'ngx-toastr';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(ToastModule),
    MessageService,
    ToasterService,
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        spinnerInterceptor,
        authInterceptor
      ])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'false',
          cssLayer: false
        },
      }
    }),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      ToastrModule.forRoot(),

    ])
  ]
};
