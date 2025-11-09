import { Component, inject } from '@angular/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from "../../components/background-image-with-text/background-image-with-text.component";
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';

interface PrivacyPolicyData {
  termId: number;
  enName: string;
  arName: string;
  enDescription: string;
  arDescription: string;
}

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [BackgroundImageWithTextComponent, TranslatePipe, NgFor, NgIf],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  languageService = inject(LanguageService)
  apiService = inject(ApiService)
  userDataService = inject(LoginSignalUserDataService)
  
  privacyPolicyData: PrivacyPolicyData[] = []
  isLoading = true
  selectedLang: string = 'ar'

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('PRIVACY.BANNER_HEADER'),
    description: this.languageService.translate('PRIVACY.BANNER_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  }

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.getPrivacyPolicyData();
    
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
      this.bkg_text_options.header = this.languageService.translate('PRIVACY.BANNER_HEADER');
      this.bkg_text_options.description = this.languageService.translate('PRIVACY.BANNER_DESC');
    });
  }

  getPrivacyPolicyData(): void {
    this.isLoading = true;
    const countryId = this.userDataService.getCountryId();
    this.apiService.get(`PrivacyPolicy/GetByCountryId/${countryId}`).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.privacyPolicyData = res.data.filter((policy: any) => policy.userType === 5);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching privacy policy data:', error);
        this.isLoading = false;
      }
    });
  }
}
