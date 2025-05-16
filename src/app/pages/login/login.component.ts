import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DOCUMENT, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToasterService } from '../../services/toaster.service';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf,TranslatePipe,ReactiveFormsModule, PasswordModule,InputTextModule,OtpModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue: string = '';
  mobileNumber: string = '';
  openOtpModal: boolean = false;
  languageService = inject(LanguageService);
  currentLang = 'en';
  selectedLang: string = localStorage.getItem('lang') || 'en';



  constructor(private fb: FormBuilder,@Inject(DOCUMENT) private document: Document, private api: ApiService, private translate: TranslateService, private router: Router) {
    this.loginForm = this.fb.group({
      userName: ['superadmin@admin.com', [Validators.required]],
      password: ['Admin@VL', [Validators.required]],
      loginMethod: [2]
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en');  // You can change this dynamically
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.onLogin(this.loginForm.value);
    } else {
      this.toaster.errorToaster('Please Complete All Feilds');
    }
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }



  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  onLogin(loginfrom: any) {
    this.api.login(loginfrom).subscribe((res: any) => {
      this.mobileNumber = res.mobilePhone;
      this.openOtpModal = res.status;
      if (!res.status) {
        localStorage.removeItem('token');
        this.toaster.errorToaster(res.message)
      }
    })
  }

  getOtpValue(e: any) {
    let otpObject = {
      "mobile": this.mobileNumber,
      "otpCode": e.otpValue
    }
    this.api.post('Authentication/VerfiyOtp', otpObject).subscribe((data: any) => {
      console.log(data.data);
      if (data.message == 'Otp Is Not Valid') {
        this.toaster.errorToaster(data.message)
      } else {
        let dataUser: any = {
          img: data.data.imgSrc,
          id: data.data.userId,
          gender: data.data.gender
        }
        localStorage.setItem('userData', JSON.stringify(dataUser))
        localStorage.setItem('token', data.data.accessToken);
        this.router.navigate(['/home']);
      }
    })
  }

  resendOtp(e: any) {
    this.onSubmit();
  }

}





























// private apiService = inject(ApiService);

//   form = new FormGroup({
//     name: new FormControl("",{
//       validators:[
//         Validators.required
//       ]
//     }),
//     password:  new FormControl("",{
//       validators:[
//         Validators.required,
//       ]
//     })
//   });

//   login() {
   
//     this.apiService.post("ContactUs/Create", this.form.value).subscribe((res) => {
//       if (res) {
//       }
//     });
//   }

