import { Component, inject, effect } from '@angular/core';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [NgIf],
  templateUrl: './whatsapp-float.component.html',
  styleUrl: './whatsapp-float.component.scss'
})
export class WhatsappFloatComponent {
  whatsappLink: string = '';
  api = inject(ApiService);
  private userDataService = inject(LoginSignalUserDataService);

  constructor() {
    // استخدام effect عشان نتابع تغييرات البلد
    effect(() => {
      // قراءة الـ signal عشان الـ effect يتابعه
      const country = this.userDataService.selectedCountry();
      console.log('Country changed in WhatsApp component:', country);
      // جلب رقم الواتساب للبلد الجديد
      this.getWhatsAppLink();
    });
  }

  getWhatsAppLink() {
    const countryId = this.userDataService.getCountryId();
    this.api.get(`settings/getAll/${countryId}`).subscribe({
      next: (res: any) => {
        console.log('WhatsApp API Response:', res);
        if (res.data && res.data.whatsAppNumber) {
          this.whatsappLink = res.data.whatsAppNumber;
        } else {
          console.log('No whatsappLink found in response');
        }
      },
      error: (error) => {
        console.error('Error fetching WhatsApp settings:', error);
      }
    });
  }

  openWhatsApp() {
    if (this.whatsappLink) {
      let link = this.whatsappLink;
      link = 'https://wa.me/'+link;
      window.open(link, '_blank');
    }
  }
}