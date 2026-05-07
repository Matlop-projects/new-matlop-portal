import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password');
  const confirm = group.get('confirmPassword');
  if (!pass || !confirm) return null;
  if (!confirm.value) return null;
  return pass.value === confirm.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf, TranslatePipe, ReactiveFormsModule, InputTextModule, PasswordModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'en';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.forgetForm = this.fb.group(
      {
        country: ['SA', Validators.required],
        mobileNumber: ['', [Validators.required, this.mobileValidator.bind(this)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: passwordsMatch }
    );

    this.forgetForm.get('country')?.valueChanges.subscribe(() => {
      this.forgetForm.get('mobileNumber')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }

  initAppTranslation(): void {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  mobileValidator(control: AbstractControl): ValidationErrors | null {
    const country = this.forgetForm?.get('country')?.value;
    const mobileNumber = control.value;
    if (!mobileNumber) return null;
    if (country === 'SA') {
      return /^5\d{8}$/.test(mobileNumber) ? null : { mobileValidator: true };
    }
    if (country === 'OM') {
      return /^[792]\d{7}$/.test(mobileNumber) ? null : { mobileValidator: true };
    }
    return { mobileValidator: true };
  }

  getMobilePlaceholder(): string {
    const country = this.forgetForm.get('country')?.value;
    if (country === 'SA') return '5xxxxxxxx';
    if (country === 'OM') return '7xxxxxxx / 9xxxxxxx / 2xxxxxxx';
    return '';
  }

  getMobileErrorMessage(): string {
    const country = this.forgetForm?.get('country')?.value;
    if (country === 'SA') return this.translate.instant('errors.saudiMobile');
    if (country === 'OM') return this.translate.instant('errors.omaniMobile');
    return this.translate.instant('errors.required');
  }

  private normalizeDomesticMobile(raw: string): string {
    let m = (raw || '').trim().replace(/\s/g, '');
    if (m && !m.startsWith('0')) m = '0' + m;
    return m;
  }

  toggleLanguage(): void {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.languageService.change(this.selectedLang);
    localStorage.setItem('lang', this.selectedLang);
    document.body.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }

  onSubmit(): void {
    if (!this.forgetForm.valid) {
      this.forgetForm.markAllAsTouched();
      this.toaster.errorToaster(this.translate.instant('errors.required'));
      return;
    }

    const raw = this.forgetForm.value;
    const mobile = this.normalizeDomesticMobile(raw.mobileNumber as string);
    const payload = {
      mobileNumber: mobile,
      password: raw.password,
      confirmPassword: raw.confirmPassword,
    };

    this.isSubmitting = true;
    this.api.post('Authentication/ForgetPassword', { mobileNumber: mobile }).subscribe({
      next: (res: any) => {
        if (!res?.status) {
          this.isSubmitting = false;
          this.toaster.errorToaster(
            res?.message || this.translate.instant('forget_pass.generic_error')
          );
          return;
        }
        this.api.post('Authentication/ResetPassword', payload).subscribe({
          next: (data: any) => {
            this.isSubmitting = false;
            const code = data?.code;
            if (code !== undefined && code !== 0 && code !== '0') {
              this.toaster.errorToaster(data?.message || this.translate.instant('forget_pass.generic_error'));
              return;
            }
            this.toaster.successToaster(data?.message || this.translate.instant('forget_pass.success'));
            this.router.navigate(['/auth/login']);
          },
          error: (err: any) => {
            this.isSubmitting = false;
            const msg = err?.error?.message || this.translate.instant('forget_pass.generic_error');
            this.toaster.errorToaster(msg);
          },
        });
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const msg = err?.error?.message || this.translate.instant('forget_pass.generic_error');
        this.toaster.errorToaster(msg);
      },
    });
  }
}
