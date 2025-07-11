import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToasterService } from '../../services/toaster.service';
import { AddLocationComponent } from '../../components/add-location/add-location.component';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';
const primengTranslations = {
  ar: {
    dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthNamesShort:  ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
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
  selector: 'app-special-order-page',
  standalone: true,
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgFor,
    Dialog,
    TranslatePipe,
    InputTextModule,
    SelectModule,
    AddLocationComponent,
    TooltipModule,
    DatePickerModule
  ],
  templateUrl: './special-order-page.component.html',
  styleUrl: './special-order-page.component.scss'
})
export class SpecialOrderPageComponent {

  api = inject(ApiService);
  languageService = inject(LanguageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toaster = inject(ToasterService);

  selectedLang = this.languageService.translationService.currentLang;
  currentLang = this.languageService.translationService.currentLang;

  showAddSpecialOrder = false;
  locations: any[] = [];
  isDragging = false;

  showAddLocationDialog: boolean = false
  minDate: Date = (() => {
    const date = new Date();
    date.setDate(date.getDate());
    return date;
  })();
  form = new FormGroup({
    clientId: new FormControl(localStorage.getItem('userId')),
    specialOrderId: new FormControl(0),
    amount: new FormControl(0),
    locationId: new FormControl('', Validators.required),
    specialOrderDate: new FormControl<any>(null, Validators.required),
    notes: new FormControl('', Validators.required),
    specialOrderEnum: new FormControl(2),
    specialOrderStatus: new FormControl(1),
    media: new FormControl<any[]>([])
  });
primengConfig=inject(PrimeNG)

  constructor() {
    this.getLocation();
     this.selectedLang = this.languageService.translationService.currentLang;
    this.displayDatepickerConfig(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayDatepickerConfig(this.selectedLang)
    });
  }
displayDatepickerConfig(lang:string) {
    this.primengConfig.setTranslation(primengTranslations[lang=='en'?'en':'ar']);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.setFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFiles(input.files);
    }
  }

  setFiles(fileList: FileList) {
    const mediaArray: { src: string; mediaTypeEnum: number }[] = [];
    const fileArray = Array.from(fileList);

    const promises = fileArray.map(file => {
      return this.convertToBase64(file).then(base64 => {
        const mediaTypeEnum = this.getMediaTypeEnum(file.type);
        if (mediaTypeEnum !== null) {
          mediaArray.push({ src: base64, mediaTypeEnum });
        }
      });
    });

    Promise.all(promises).then(() => {
      this.form.patchValue({ media: mediaArray });
      this.form.get('media')?.markAsTouched();
      console.log('Media array:', mediaArray);
    });
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  getMediaTypeEnum(mimeType: string): 1 | 2 | null {
    if (mimeType.startsWith('image/')) return 1;
    if (mimeType.startsWith('video/')) return 2;
    return null;
  }

  submitForm() {
    if (this.form.valid) {

      const localDate = new Date(this.form.value.specialOrderDate);
      const year = localDate.getFullYear();
      const month = localDate.getMonth();
      const day = localDate.getDate();
      // Set the time to noon (12:00) to avoid shifting the day when converting to UTC
      let newDate = new Date(year, month, day, 12);
      this.form.patchValue({
        specialOrderDate: newDate
      });
      const payload = this.form.value;
      this.createEmergencyOrder(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  createEmergencyOrder(payload: any) {
    this.api.post('SpecialOrder/Create', payload).subscribe(res => {
      setTimeout(() => {
        this.router.navigate(['/home'])
      }, 1000);
    });
  }

  getLocation() {
    const userId = localStorage.getItem('userId');
    this.api.get('Location/GetByUserId/' + userId).subscribe((res: any) => {
      if (res.data) {
        this.locations = res.data.map((item: any) => ({
          name: item.countryName,
          code: item.locationId
        }));
      }
    });
  }

  selectLocation(data: any) {
    this.form.value.locationId = data.value;
  }

  addLocation() {
    this.showAddLocationDialog = true
  }
  
  API_addLocation(payload: any) {
    this.api
      .post('Location/Create', payload)
      .subscribe((res) => {
        if (res) {
          this.toaster.successToaster('تم اضافه موقع')
          this.getLocation();
        }
      });
  }

  onAddLocation(formValue: any) {
    this.API_addLocation(formValue)
    this.showAddLocationDialog = false
  }

  removeMedia(index: number) {
    const mediaControl = this.form.get('media');
    if (mediaControl && Array.isArray(mediaControl.value)) {
      const updated = [...mediaControl.value];
      updated.splice(index, 1);
      mediaControl.setValue(updated);
    }
  }
}

