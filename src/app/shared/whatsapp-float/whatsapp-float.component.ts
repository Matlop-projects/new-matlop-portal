import { Component, inject, OnInit } from '@angular/core';
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
export class WhatsappFloatComponent implements OnInit {
  whatsappLink: string = '';
  api = inject(ApiService);
      private userDataService = inject(LoginSignalUserDataService);

  ngOnInit(): void {
    this.getWhatsAppLink();
  }

  getWhatsAppLink() {
      const countryId = this.userDataService.getCountryId();
    this.api.get(`settings/getAll/${countryId}`).subscribe({
      next: (res: any) => {
        console.log('WhatsApp API Response:', res);
        if (res.data && res.data.whatsappLink) {
          this.whatsappLink = res.data.whatsappLink;
          console.log('WhatsApp Link set to:', this.whatsappLink);
        } else {
          console.log('No whatsappLink found in response');
          // For testing purposes, set a default WhatsApp link
          this.whatsappLink = 'https://wa.me/966510021622';
        }
      },
      error: (error) => {
        console.error('Error fetching WhatsApp settings:', error);
        // For testing purposes, set a default WhatsApp link
        this.whatsappLink = 'https://wa.me/966510021622';
      }
    });
  }

  openWhatsApp() {
    if (this.whatsappLink) {
      let link = this.whatsappLink;
      if (!/^https?:\/\//i.test(link)) {
        link = 'https://' + link;
      }
      window.open(link, '_blank');
    }
  }
}