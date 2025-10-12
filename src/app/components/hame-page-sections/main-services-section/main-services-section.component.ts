import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { environment } from '../../../../environments/environment';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-main-services-section',
  standalone: true,
  imports: [NgIf, NgStyle, RouterModule, TranslatePipe, CommonModule],
  templateUrl: './main-services-section.component.html',
  styleUrl: './main-services-section.component.scss'
})
export class MainServicesSectionComponent {
  @ViewChild('sliderContainer', { static: false }) sliderContainer!: ElementRef;

  api = inject(ApiService);
  services: any;
  private imageUrl = environment.baseImageUrl;
  selectedLang: any;
  languageService = inject(LanguageService);
  private router = inject(Router);

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    console.log(this.selectedLang);
    
    this.getAllServices();
    localStorage.removeItem('contractDetails');
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

  isServiceList() {
    return this.router.url.includes('/services/list')
  }

  getAllServices() {
    this.api.get('Service/GetAll').subscribe((res: any) => {
      if (res?.data) {
        this.services = res.data.map((service: any) => ({
          ...service,
          image: this.imageUrl + service.image,
        }));
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

  slideLeft() {
    if (this.sliderContainer) {
      const container = this.sliderContainer.nativeElement;
      container.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  }

  slideRight() {
    if (this.sliderContainer) {
      const container = this.sliderContainer.nativeElement;
      container.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  }
}