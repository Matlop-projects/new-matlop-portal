import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators , AbstractControl , ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf,OtpModalComponent,TranslatePipe, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule  , RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponentimplements implements OnInit{
  checkMobile: FormGroup;
  changePassword: FormGroup;

  toaster = inject(ToasterService)  ;
  hideCheckForm: boolean = false;
  openOtpModal: boolean = false;

languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang: string = localStorage.getItem('lang') || 'en';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.checkMobile = this.fb.group({
      mobileNumber: ['', [Validators.required]]
    });

    this.changePassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
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

  onSubmit() {
    if (this.checkMobile.valid) {
      let mobileNumberObject ={
        "mobileNumber": this.checkMobile.value.mobileNumber
      }
      this.api.post('Authentication/ForgetPassword' , mobileNumberObject).subscribe((res: any) => {
        console.log(res);
        if(res.status) {
          this.openOtpModal = true;
        } else {
          this.toaster.errorToaster(res.message);
        }
      })
    } else {
      this.toaster.errorToaster('Please add your mobile number');
    }
  }


  onOtpSubmit() {
    if (this.changePassword.valid) {
      console.log('Form Submitted', this.changePassword.value);
      this.changePassword.value.mobileNumber = this.checkMobile.get('mobileNumber')?.value;
      this.api.post('Authentication/ResetPassword',  this.changePassword.value).subscribe((data: any) => {
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

  getOtpValue(e: any) {
    console.log(e);
    let otpObject = {
      "mobile": this.checkMobile.get('mobileNumber')?.value,
      "otpCode": e.otpValue
    }
    this.api.post('Authentication/VerfiyForgetPassword', otpObject).subscribe((data: any) => {
      console.log(data.data);
      if(data.message == 'Otp Is Not Valid') {
        this.toaster.errorToaster(data.message)
      } else {
         this.hideCheckForm = true;
         this.openOtpModal = false;
      }
    })
  }

  resendOtp(e: any) {
    console.log(e);
    this.onSubmit();
  }

}
