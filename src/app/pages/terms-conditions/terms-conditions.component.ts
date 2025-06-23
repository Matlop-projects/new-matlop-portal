import { Component, inject } from '@angular/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../components/background-image-with-text/background-image-with-text.component';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [BackgroundImageWithTextComponent , TranslatePipe],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent {
  languageService = inject(LanguageService)
  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('TERMS.BANNER_HEADER'),
    description: this.languageService.translate('TERMS.BANNER_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  }

  ngOnInit(): void {
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.bkg_text_options.header = this.languageService.translate('TERMS.BANNER_HEADER');
      this.bkg_text_options.description = this.languageService.translate('TERMS.BANNER_DESC');
    });
  }
}