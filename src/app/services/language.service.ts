import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // Expose translationService for components that need direct access
  public translationService = inject(TranslateService);
  private document = inject(DOCUMENT);

  private readonly STORAGE_KEY = 'lang';
  private readonly DEFAULT_LANG = 'en';

  constructor() {
    this.initDirection();
  }

  private initDirection(): void {
    const savedLang = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANG;
    this.changeAppDirection(savedLang);
    this.changeHtmlLang(savedLang);
  }

  public change(language: string): void {
    this.translationService.use(language);
    localStorage.setItem(this.STORAGE_KEY, language);
    this.changeAppDirection(language);
    this.changeHtmlLang(language);
  }

  public use(language: string): void {
    this.translationService.use(language);
  }

  public translate(key: string): string {
    if (!key) return '';
    const translation = this.translationService.instant(key);
    return translation !== key ? translation : key;
  }

  public getCurrentLang(): string {
    return this.translationService.currentLang || localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANG;
  }

  // Expose onLangChange observable for components
  public get onLangChange() {
    return this.translationService.onLangChange;
  }

  // Expose currentLang for components
  public get currentLang(): string {
    return this.translationService.currentLang;
  }

  public changeAppDirection(local: string): void {
    const dir = local === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.dir = dir;
    this.document.body.dir = dir;
  }

  public changeHtmlLang(local: string): void {
    const lang = local === 'ar' ? 'ar' : 'en';
    this.document.documentElement.lang = lang;
  }
}
