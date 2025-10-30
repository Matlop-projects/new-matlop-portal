import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Validations } from '../../validations';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { SelectModule } from 'primeng/select';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { PrimeNG } from 'primeng/config';
import { LanguageService } from '../../services/language.service';
const primengTranslations = {
  ar: {
    dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    today: 'اليوم',
    clear: 'مسح',
    dateFormat: 'dd/mm/yy',
    firstDayOfWeek: 0,
    weekHeader: 'أسبوع',
  },
  en: {
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'dd/mm/yy',
    firstDayOfWeek: 0,
    weekHeader: 'Wk',
  }
};
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslatePipe, NgIf, FloatLabelModule, ReactiveFormsModule, DatePickerModule, InputTextModule, SelectModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  baseImageUrl = environment.baseImageUrl
  defaultImg: any = "assets/img/arabian-man.png"
  user: any;
  userId = localStorage.getItem('userId')
  showBtn = false
  genderList: any[] = [

  ]
  private apiService = inject(ApiService);
  private Router = inject(Router)
  private langService = inject(LanguageService)
  primengConfig = inject(PrimeNG)

  form = new FormGroup({
    firstName: new FormControl("", {
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
    gender: new FormControl("", {
      validators: [
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
    dateOfBirth: new FormControl<any>('', {
      validators: [Validators.required],
    }),
    imgSrc: new FormControl<any>("",),
  });
  languageService = inject(LanguageService);
  selectedLang: any;

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.setGenderList();
    this.getUserById();
    this.displayDatepickerConfig(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.setGenderList();
      this.displayDatepickerConfig(this.selectedLang)
    });
  }

  setGenderList() {
    this.genderList = [
      { name: this.selectedLang == 'en' ? 'Male' : "ذكر", code: 1 },
      { name: this.selectedLang == 'en' ? 'Female' : "أنثى", code: 2 }
    ]
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.patchValue({ imgSrc: base64 });
      this.user.imgSrc = base64; // for api 
      this.defaultImg = base64 // for immediate preview
    };

    reader.readAsDataURL(file);
  }
  displayDatepickerConfig(lang: string) {
    this.primengConfig.setTranslation(primengTranslations[lang == 'en' ? 'en' : 'ar']);
  }
  onEditMode() {
    ;
    this.showBtn = true
  }
  getUserById() {
    this.apiService.get(`client/getById/${this.userId}`).subscribe((res: any) => {
      this.user = res.data;
      this.form.patchValue({
        firstName: this.user?.firstName,
        email: this.user?.email,
        gender: this.user?.gender,
        dateOfBirth: new Date(this.user.dateOfBirth),
        imgSrc: this.baseImageUrl + this.user?.imgSrc
      })
      
      // إصلاح منطق عرض الصورة
      if (this.user?.imgSrc && this.user.imgSrc !== 'null' && this.user.imgSrc !== null) {
        this.defaultImg = this.baseImageUrl + this.user.imgSrc;
      } else {
        this.defaultImg = "assets/img/arabian-man.png";
      }
      
      console.log('User image:', this.defaultImg);
    })
  }
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onUpdate() {
    console.log(this.user);
    let payload = {
      ...this.user,
      ...this.form.value,
      dateOfBirth: this.formatDateToYYYYMMDD(this.form.value.dateOfBirth),

    }
    this.apiService.put('client/update', payload).subscribe(res => {
      if (res) {
        this.getUserById()
        this.showBtn = false;
        localStorage.setItem('img', this.form.value.imgSrc);
        this.Router.navigateByUrl('home')
      }
    })

  }
  onCancel() {
    this.showBtn = false;
    this.getUserById(); // إعادة تحميل البيانات الأصلية
  }
}
