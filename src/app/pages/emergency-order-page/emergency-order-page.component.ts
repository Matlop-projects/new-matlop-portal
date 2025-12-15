import { Component, inject, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-emergency-order-page',
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
    TooltipModule
  ],
  templateUrl: './emergency-order-page.component.html',
  styleUrl: './emergency-order-page.component.scss'
})
export class EmergencyOrderPageComponent {
  @ViewChild('addLocationComponent') addLocationComponent?: AddLocationComponent;
  
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
  isSubmitting: boolean = false; // To prevent multiple clicks

  showAddLocationDialog: boolean = false


  form = new FormGroup({
    clientId: new FormControl(localStorage.getItem('userId')),
    specialOrderId: new FormControl(0),
    amount: new FormControl(0),
    locationId: new FormControl('', Validators.required),
    specialOrderDate: new FormControl<any>(null),
    notes: new FormControl('', Validators.required),
    specialOrderEnum: new FormControl(1),
    specialOrderStatus: new FormControl(1),
    media: new FormControl<any[]>([])
  });

  constructor() {
    this.getLocation();
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
    // Prevent multiple submissions
    if (this.isSubmitting) {
      return;
    }

    if (this.form.valid) {
      this.form.patchValue({
        specialOrderDate: new Date().toISOString()
      });
      const payload = this.form.value;
      this.createEmergencyOrder(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  createEmergencyOrder(payload: any) {
    // Disable button
    this.isSubmitting = true;

    this.api.post('SpecialOrder/Create', payload).subscribe({
      next: (res) => {
        this.toaster.successToaster(
          this.languageService.translate('EMERGENCY_ORDER.SUCCESS') || 'تم انشاء الطلب بنجاح'
        );
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        // Re-enable button on error
        this.isSubmitting = false;
        console.error('Emergency order creation failed:', err);
        this.toaster.errorToaster(
          this.languageService.translate('EMERGENCY_ORDER.ERROR') || 'حدث خطأ أثناء إنشاء الطلب'
        );
      }
    });
  }

  getLocation() {
    const userId = localStorage.getItem('userId');
    this.api.get('Location/GetByUserId/' + userId).subscribe((res: any) => {
      if (res.data) {
        this.locations = res.data.map((item: any) => ({
            name:`${item.countryName} - ${item.cityName}  ${item.districtName?' - '+item.districtName:''}  ${item.blockNo?' - '+item.blockNo:''}`,
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

  onDialogShow() {
    // Refresh the map when dialog opens
    setTimeout(() => {
      this.addLocationComponent?.refreshMap();
    }, 100);
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
