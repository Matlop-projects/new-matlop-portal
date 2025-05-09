import { Component,inject, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-order-now-section',
  standalone: true,
  imports: [],
  templateUrl: './order-now-section.component.html',
  styleUrl: './order-now-section.component.scss'
})
export class OrderNowSectionComponent  implements OnInit {
  languageService = inject(LanguageService);
    selectedLang: string = localStorage.getItem('lang') || 'ar';
 
  ngOnInit(): void {
        this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang
    });
    }
}
