import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  translationService = inject(TranslateService);

  public change(language: string) {
    this.translationService.use(language);
    localStorage.setItem('lang', language);
    // location.reload();
  }

  public use(language: string) {
    this.translationService.use(language);
  }

  public translate(key: string): string {
    return this.translationService.instant(key);
  }

  public changeAppDirection(local: string): void {
    document.body.dir = local === 'ar' ? 'rtl' : 'ltr';

    return local === 'en'
      ? document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr')
      : document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');

  }

  public changeHtmlLang(local: string): void {
    document.body.dir = local === 'ar' ? 'rtl' : 'ltr';

    return local === 'en'
      ? document.getElementsByTagName('html')[0].setAttribute('lang', 'en')
      : document.getElementsByTagName('html')[0].setAttribute('lang', 'ar');
  }
}
