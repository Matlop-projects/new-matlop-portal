import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { ApiService } from "../../services/api.service";
import { Validations } from "../../validations";
import { GalleriaModule } from 'primeng/galleria';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from "../../components/background-image-with-text/background-image-with-text.component";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "../../services/language.service";
@Component({
  selector: "app-about-us",
  standalone: true,
  imports: [ReactiveFormsModule, BackgroundImageWithTextComponent, TranslatePipe, InputTextModule, TextareaModule, GalleriaModule, FormsModule, BackgroundImageWithTextComponent],
  templateUrl: "./about-us.component.html",
  styleUrl: "./about-us.component.scss",
})
export class AboutUsComponent {


  languageService = inject(LanguageService)

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('ABOUT_US_CONTACT.BANNER_HEADER'),
    description: this.languageService.translate('ABOUT_US_CONTACT.BANNER_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  };

  someWorksImages: any[] = [
    {
      itemImageSrc: 'assets/img/some-work-4.svg',
      thumbnailImageSrc: 'assets/img/some-work-4.svg',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: 'assets/img/some-work-3.svg',
      thumbnailImageSrc: 'assets/img/some-work-3.svg',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: 'assets/img/some-work-2.svg',
      thumbnailImageSrc: 'assets/img/some-work-2.svg',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: 'assets/img/some-work-1.svg',
      thumbnailImageSrc: 'assets/img/some-work-1.svg',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
  ]
  private apiService = inject(ApiService);

  form = new FormGroup({
    name: new FormControl("", {
      validators: [
        Validators.required
      ]
    }),
    email: new FormControl("", {
      validators: [
        Validators.required,
        Validations.emailValidator()
      ]
    }),
    mobile: new FormControl("", {
      validators: [
        Validators.required,
        Validations.mobileStartWithNumber_5_Validator(),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]
    }),
    message: new FormControl("", {
      validators: [
        Validators.required
      ]
    }),
  });

  ngOnInit(): void {
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.bkg_text_options.header = this.languageService.translate('ABOUT_US_CONTACT.BANNER_HEADER');
      this.bkg_text_options.description = this.languageService.translate('ABOUT_US_CONTACT.BANNER_DESC');
    });
  }

  onContactUs() {
    this.apiService.post("ContactUs/Create", this.form.value).subscribe((res) => {
      if (res) {
      }
    });
  }
}
