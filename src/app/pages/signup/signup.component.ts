import { Component, Inject, inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ApiService } from "../../services/api.service";
import { PasswordModule } from "primeng/password";
import { InputTextModule } from "primeng/inputtext";
import { DOCUMENT, NgIf } from "@angular/common";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ToasterService } from "../../services/toaster.service";
import { LanguageService } from "../../services/language.service";
import { Router, RouterModule } from "@angular/router";
import { ModalComponent } from "../../components/modal/modal.component";
import { OtpModalComponent } from "../../components/otp-modal/otp-modal.component";
import { CheckboxModule } from "primeng/checkbox";
import { CarouselModule } from "primeng/carousel";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe,
    CarouselModule,
    ReactiveFormsModule,
    CheckboxModule,
    RouterModule,
    PasswordModule,
    InputTextModule,
    OtpModalComponent,
  ],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.scss",
})
export class SignupComponent {
  signupForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue: string = "";
  mobileNumber: string = "";
  openOtpModal: boolean = false;
  languageService = inject(LanguageService);
  currentLang = "en";
  selectedLang: string = localStorage.getItem("lang") || "en";

  carouselImages: string[] = [
    "assets/images/backgrounds/register-slider1.svg",
    "assets/images/backgrounds/register-slider2.svg",
    "assets/images/backgrounds/register-slider3.svg",
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: [
          "",
          {
            validators: [Validators.required, Validators.minLength(3)],
          },
        ],
        lastName: [
          "",
          {
            validators: [Validators.required, Validators.minLength(3)],
          },
        ],
        userName: [
          "",
          {
            validators: [Validators.required, Validators.minLength(3)],
          },
        ],
        email: ["", [Validators.required, Validators.email]],
        mobileNumber: [
          "",
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(/^05\d{8}$/),
          ],
        ],
        genderId: [1, Validators.required],
      },
    );

    this.translate.setDefaultLang("en");
    this.translate.use("en"); // You can change this dynamically
  }

  ngOnInit(): void {
    this.initAppTranslation();
  }
  onSubmit() {
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;

      const signupPayload = {
        userId: 0,
        roleId: 1,
        isActive: true,
        ...formValue,
      };

      this.api
        .post("Authentication/Register", signupPayload)
        .subscribe((res: any) => {
          this.toaster.successToaster("تم إنشاء الحساب بنجاح");
          this.router.navigate(["/auth/login"]);
        });
    } else {
      this.toaster.errorToaster("يرجى إكمال جميع الحقول");
    }
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === "en" ? "ar" : "en";
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", this.selectedLang);
    document.documentElement.setAttribute(
      "dir",
      this.selectedLang === "ar" ? "rtl" : "ltr"
    );
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
        localStorage.removeItem("token");
        this.toaster.errorToaster(res.message);
      }
    });
  }

  getOtpValue(e: any) {
    let otpObject = {
      mobile: this.mobileNumber,
      otpCode: e.otpValue,
    };
    this.api
      .post("Authentication/VerfiyOtp", otpObject)
      .subscribe((data: any) => {
        console.log(data.data);
        if (data.message == "Otp Is Not Valid") {
          this.toaster.errorToaster(data.message);
        } else {
          let dataUser: any = {
            img: data.data.imgSrc,
            id: data.data.userId,
            gender: data.data.gender,
          };
          localStorage.setItem("userData", JSON.stringify(dataUser));
          localStorage.setItem("userId", JSON.stringify(dataUser.id));
          localStorage.setItem("token", data.data.accessToken);
          this.router.navigate(["/home"]);
        }
      });
  }

  resendOtp(e: any) {
    this.onSubmit();
  }
}

