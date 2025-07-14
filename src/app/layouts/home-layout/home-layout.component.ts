import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from '../../shared/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule, // ✅ Use the full module
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {
  showMenuIcon = false;
  currentLang = 'ar';
  selectedLang: string = 'ar';
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);

  constructor(private translate: TranslateService) {
    // Check for stored or current language
    const savedLang = this.languageService.translationService.currentLang || localStorage.getItem('lang');

    if (savedLang) {
      this.translate.setDefaultLang(savedLang);
      this.languageService.use(savedLang);
      this.currentLang = savedLang;
    } else {
      this.translate.setDefaultLang('ar');
      this.languageService.use('ar');
      this.currentLang = 'ar';
    }
  }

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
    });
  }
}

