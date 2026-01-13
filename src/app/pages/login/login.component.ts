import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DOCUMENT, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToasterService } from '../../services/toaster.service';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';
import { CheckboxModule } from 'primeng/checkbox';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf,TranslatePipe,ReactiveFormsModule,CheckboxModule,RouterModule , PasswordModule,InputTextModule,OtpModalComponent],
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



  constructor(private fb: FormBuilder,@Inject(DOCUMENT) private document: Document, private api: ApiService, private translate: TranslateService, private router: Router ,private userDataSignals: LoginSignalUserDataService) {
    this.loginForm = this.fb.group({
      country: ['SA'], // Default to Saudi Arabia
      userName: ['',  [
            Validators.required,
            this.mobileValidator.bind(this)
          ],],
      loginMethod: [1]
    });

    // Listen to country changes to update validation
    this.loginForm.get('country')?.valueChanges.subscribe(() => {
      this.loginForm.get('userName')?.updateValueAndValidity();
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en');  // You can change this dynamically
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = { ...this.loginForm.value };
      ;
      
      // Detect country based on mobile number pattern
      let detectedCountry = formValue.country; // Default to selected country
      if (formValue.userName) {
        const mobile = formValue.userName.replace(/^0/, ''); // Remove leading 0 if exists
        
        // Saudi mobile: starts with 5 and has 9 digits total
        if (/^5\d{8}$/.test(mobile)) {
          detectedCountry = 'SA';
        }
        // Omani mobile: starts with 7, 9, or 2 and has 8 digits total
        else if (/^[792]\d{7}$/.test(mobile)) {
          detectedCountry = 'OM';
        }
      }
      
      // Store detected country in user data service
      this.userDataSignals.setSelectedCountry(detectedCountry);
      
      // Update form country to match detected country
      formValue.country = detectedCountry;
      
      // Ensure mobile number starts with 0
      if (formValue.userName && !formValue.userName.startsWith('0')) {
        ;
        formValue.userName = '0' + formValue.userName;
      }
      
      this.onLogin(formValue);
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
    this.openOtpModal = false;
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
          img: environment.baseImageUrl+data.data.mobileImgSrc,
          id: data.data.userId,
          gender: data.data.gender,
          token: data.data.token,
          userType:data.data.userTypeId
        }
        this.userDataSignals.setUser(dataUser);

        localStorage.setItem('userData', JSON.stringify(dataUser));
        localStorage.setItem('userId', JSON.stringify(dataUser.id))
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('img',dataUser.img);
        localStorage.setItem('userType',dataUser.userType)
        // Set countryId based on detected phone number (SA=1, OM=2)
        localStorage.setItem('countryId', this.userDataSignals.getCountryId().toString());
        this.router.navigate(['/home']);
      }
    })
  }

  resendOtp(e: any) {
    this.onSubmit();
  }

  loginAsGuest() {
    // Set default country to Saudi Arabia for guest users
    this.userDataSignals.setSelectedCountry('SA');
    // Set countryId = 1 for Saudi Arabia
    localStorage.setItem('countryId', '1');
    // Navigate directly to home page as guest
    this.router.navigate(['/home']);
  }

  // Custom mobile validator for Saudi and Omani numbers
  mobileValidator(control: any) {
    const country = this.loginForm?.get('country')?.value;
    const mobile = control.value;
    
    if (!mobile) {
      return null; // Let required validator handle empty values
    }

    if (country === 'SA') {
      // Saudi mobile: 9 digits starting with 5 (without country code)
      const saudiPattern = /^5\d{8}$/;
      if (!saudiPattern.test(mobile)) {
        return { pattern: true };
      }
    } else if (country === 'OM') {
      // Omani mobile: 8 digits starting with 7, 9, or 2 (without country code)
      const omaniPattern = /^[792]\d{7}$/;
      if (!omaniPattern.test(mobile)) {
        return { pattern: true };
      }
    }

    return null;
  }

  // Get country code for display
  getCountryCode(): string {
    const country = this.loginForm?.get('country')?.value;
    return country === 'SA' ? '+966' : '+968';
  }

  // Get mobile placeholder based on country
  getMobilePlaceholder(): string {
    const country = this.loginForm.get('country')?.value;
    if (country === 'SA') {
      return '5xxxxxxxx';
    } else if (country === 'OM') {
      return '7xxxxxxx / 9xxxxxxx / 2xxxxxxx';
    }
    return '';
  }

  // Get mobile error message based on country
  getMobileErrorMessage(): string {
    const country = this.loginForm?.get('country')?.value;
    if (country === 'SA') {
      return this.translate.instant('errors.saudiMobile');
    } else {
      return this.translate.instant('errors.omaniMobile');
    }
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

