import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { environment } from '../../../../environments/environment';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [NgIf, NgStyle, NgFor],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent {
  api = inject(ApiService);
  services: any;
  private imageUrl = environment.baseImageUrl;
  selectedLang: any;
  languageService = inject(LanguageService);
  private router = inject(Router)


  ngOnInit(): void {
    this.getAllServices();
    localStorage.removeItem('contractDetails');
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      // this.setImageLanguage();
    })
  }

  isServiceList() {
    return this.router.url.includes('/services/list')
  }

  getAllServices() {
    this.api.get('Service/GetAll').subscribe((res: any) => {
      if (res?.data) {
        const fullList = res.data.map((service: any) => ({
          ...service,
          image: this.imageUrl + service.image,
        }));

        // Keep only the first 4
        this.services = fullList;
      }
    });
  }

  setImageLanguage() {
    if (this.services) {
      this.services.forEach((img: any) => {
        img.image = this.imageUrl + img.image;
      });
    }
  }

  goReservation(id: string) {
    this.router.navigate(['reservation', id])
  }

  goContractList(id: any) {
    this.router.navigate(['/contract-list', id])
  }
}

