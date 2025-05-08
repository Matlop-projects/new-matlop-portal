import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  currentLang = 'ar';
  selectedLang: string = localStorage.getItem('lang') || 'ar';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('ar');
    this.translate.use('ar');  // You can change this dynamically
  }

  ngOnInit(): void {
    this.initAppTranslation();
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      // this.toaster.successToaster('GENERAL');
    })
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }
}
