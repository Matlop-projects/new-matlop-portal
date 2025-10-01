import { Component, inject } from '@angular/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../components/background-image-with-text/background-image-with-text.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface TermsConditionsData {
  termId: number;
  enName: string;
  arName: string;
  enDescription: string;
  arDescription: string;
}

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [BackgroundImageWithTextComponent, TranslatePipe, NgFor, NgIf],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent {
  languageService = inject(LanguageService)
  apiService = inject(ApiService)
  
  termsConditionsData: TermsConditionsData[] = []
  isLoading = true
  selectedLang: string = 'ar'

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('TERMS.BANNER_HEADER'),
    description: this.languageService.translate('TERMS.BANNER_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  }

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.getTermsConditionsData();
    
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
      this.bkg_text_options.header = this.languageService.translate('TERMS.BANNER_HEADER');
      this.bkg_text_options.description = this.languageService.translate('TERMS.BANNER_DESC');
    });
  }

  getTermsConditionsData(): void {
    this.isLoading = true;
    this.apiService.get('TermsAndConditions/GetAll').subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.termsConditionsData = res.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching terms and conditions data:', error);
        this.isLoading = false;
      }
    });
  }
}