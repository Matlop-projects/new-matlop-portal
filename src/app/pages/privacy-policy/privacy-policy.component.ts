import { Component, inject } from '@angular/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from "../../components/background-image-with-text/background-image-with-text.component";
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [BackgroundImageWithTextComponent, TranslatePipe],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  languageService = inject(LanguageService)

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('PRIVACY.BANNER_HEADER'),
    description: this.languageService.translate('PRIVACY.BANNER_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  }


  ngOnInit(): void {
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.bkg_text_options.header = this.languageService.translate('PRIVACY.BANNER_HEADER');
      this.bkg_text_options.description = this.languageService.translate('PRIVACY.BANNER_DESC');
    });
  }
}
