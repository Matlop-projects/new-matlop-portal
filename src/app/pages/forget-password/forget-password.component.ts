import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators , AbstractControl , ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf, TranslatePipe, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule , RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponentimplements implements OnInit{
  checkMobile: FormGroup;
  changePassword: FormGroup;

  toaster = inject(ToasterService)  ;
  hideCheckForm: boolean = false;

languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang: string = localStorage.getItem('lang') || 'en';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.checkMobile = this.fb.group({
      mobileNumber: ['', [Validators.required]]
    });

    this.changePassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });

  }

  ngOnInit() {
      this.initAppTranslation()
  }
  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  private normalizeDomesticMobile(raw: string): string {
    let m = (raw || '').trim().replace(/\s/g, '');
    if (m && !m.startsWith('0')) {
      m = '0' + m;
    }
    return m;
  }

  onSubmit() {
    if (this.checkMobile.valid) {
      const mobile = this.normalizeDomesticMobile(this.checkMobile.value.mobileNumber);
      this.api.post('Authentication/ForgetPassword' , { mobileNumber: mobile }).subscribe((res: any) => {
        console.log(res);
        if(res.status) {
          this.checkMobile.patchValue({ mobileNumber: mobile });
          this.hideCheckForm = true;
        } else {
          this.toaster.errorToaster(res.message);
        }
      })
    } else {
      this.toaster.errorToaster('Please add your mobile number');
    }
  }


  onChangePasswordSubmit() {
    if (this.changePassword.valid) {
      const mobile = this.normalizeDomesticMobile(this.checkMobile.get('mobileNumber')?.value || '');
      const payload = {
        ...this.changePassword.value,
        mobileNumber: mobile,
      };
      this.api.post('Authentication/ResetPassword', payload).subscribe((data: any) => {
        console.log(data.data);
          this.toaster.successToaster(data.message);
          this.router.navigate(['/auth/login']);
      })
    } else {
      if (this.changePassword.hasError('passwordsDoNotMatch')) {
        this.toaster.errorToaster('Passwords do not match');
      } else {
        this.toaster.errorToaster('Please complete all fields');
      }
    }
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);
    localStorage.setItem('lang', this.selectedLang);
    document.body.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.selectedLang);
  }

}
