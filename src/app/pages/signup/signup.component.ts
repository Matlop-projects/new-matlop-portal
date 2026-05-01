import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DOCUMENT, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToasterService } from '../../services/toaster.service';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password');
  const confirm = group.get('confirmPassword');
  if (!pass || !confirm) {
    return null;
  }
  if (!confirm.value) {
    return null;
  }
  return pass.value === confirm.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe,
    ReactiveFormsModule,
    RouterModule,
    PasswordModule,
    InputTextModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'en';

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        country: ['SA', Validators.required],
        mobileNumber: ['', [Validators.required, this.mobileValidator.bind(this)]],
        genderId: [1, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: passwordsMatch }
    );

    this.signupForm.get('country')?.valueChanges.subscribe(() => {
      this.signupForm.get('mobileNumber')?.updateValueAndValidity();
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }

  onSubmit(): void {
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      this.toaster.errorToaster(this.translate.instant('errors.required'));
      return;
    }

    const raw = { ...this.signupForm.value };
    let mobile = raw.mobileNumber as string;
    if (mobile && !String(mobile).startsWith('0')) {
      mobile = '0' + mobile;
    }

    const payload = {
      mobileNumber: mobile,
      genderId: Number(raw.genderId),
      password: raw.password,
    };

    this.api.post('Authentication/Register', payload).subscribe({
      next: (res: any) => {
        if (res?.code !== 0) {
          this.toaster.errorToaster(res?.message || this.translate.instant('shared.errors.general'));
          return;
        }
        localStorage.setItem('clientMobile', mobile);
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        const msg = err?.error?.message || this.translate.instant('shared.errors.general');
        this.toaster.errorToaster(msg);
      },
    });
  }

  toggleLanguage(): void {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.languageService.change(this.selectedLang);
    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute(
      'dir',
      this.selectedLang === 'ar' ? 'rtl' : 'ltr'
    );
  }

  initAppTranslation(): void {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  mobileValidator(control: AbstractControl): ValidationErrors | null {
    const country = this.signupForm?.get('country')?.value;
    const mobileNumber = control.value;
    if (!mobileNumber) {
      return null;
    }
    if (country === 'SA') {
      return /^5\d{8}$/.test(mobileNumber) ? null : { mobileValidator: true };
    }
    if (country === 'OM') {
      return /^[792]\d{7}$/.test(mobileNumber) ? null : { mobileValidator: true };
    }
    return { mobileValidator: true };
  }

  getMobilePlaceholder(): string {
    const country = this.signupForm.get('country')?.value;
    if (country === 'SA') {
      return '5xxxxxxxx';
    }
    if (country === 'OM') {
      return '7xxxxxxx / 9xxxxxxx / 2xxxxxxx';
    }
    return '';
  }

  getMobileErrorMessage(): string {
    const country = this.signupForm?.get('country')?.value;
    if (country === 'SA') {
      return this.translate.instant('errors.saudiMobile');
    }
    if (country === 'OM') {
      return this.translate.instant('errors.omaniMobile');
    }
    return this.translate.instant('errors.required');
  }
}
