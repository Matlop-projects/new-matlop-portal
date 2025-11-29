import { Component, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { ApiService } from "../../services/api.service";
import { Validations } from "../../validations";
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from "../../components/background-image-with-text/background-image-with-text.component";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, BackgroundImageWithTextComponent, TranslatePipe, InputTextModule, TextareaModule, FormsModule, NgIf],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  languageService = inject(LanguageService)
  private apiService = inject(ApiService);

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('ABOUT_US_CONTACT.BANNER_HEADER'),
    description: this.languageService.translate('ABOUT_US_CONTACT.BANNER_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  };

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
        Validators.maxLength(10)
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
    // Mark all fields as touched to show validation errors
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.apiService.post("ContactUs/Create", this.form.value).subscribe((res) => {
      // Reset the form after successful submission
      this.form.reset();
    });
  }
}
