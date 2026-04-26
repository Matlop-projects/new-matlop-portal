import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  installBrowserHardening();
}

/** Light deterrent only — cannot stop DevTools; real protection is on the server. */
function installBrowserHardening(): void {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
      e.preventDefault();
    }
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
