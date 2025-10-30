import { Component, inject, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { environment } from '../../../../environments/environment';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-main-services-section',
  standalone: true,
  imports: [NgIf, NgStyle, RouterModule, TranslatePipe, CommonModule],
  templateUrl: './main-services-section.component.html',
  styleUrl: './main-services-section.component.scss'
})
export class MainServicesSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sliderContainer', { static: false }) sliderContainer!: ElementRef;

  api = inject(ApiService);
  services: any;
  private imageUrl = environment.baseImageUrl;
  selectedLang: any;
  languageService = inject(LanguageService);
  private router = inject(Router);
  
  // Auto-slide properties
  private autoSlideSubscription?: Subscription;
  private autoSlideInterval = 3000; // 3 seconds
  private currentSlideIndex = 0;
  private cardsPerView = 3; // عرض 3 كروت في كل مرة

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    console.log(this.selectedLang);
    
    this.getAllServices();
    localStorage.removeItem('contractDetails');
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

  ngAfterViewInit(): void {
    // Start auto-slide after view is initialized
    if (this.services?.length > this.cardsPerView) {
      setTimeout(() => {
        this.startAutoSlide();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    if (this.services?.length > this.cardsPerView) {
      this.autoSlideSubscription = interval(this.autoSlideInterval).subscribe(() => {
        this.autoSlideNext();
      });
    }
  }

  stopAutoSlide(): void {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
      this.autoSlideSubscription = undefined;
    }
  }

  private autoSlideNext(): void {
    if (this.sliderContainer && this.services?.length > this.cardsPerView) {
      const container = this.sliderContainer.nativeElement;
      const cardWidth = 320 + 16; // card width + gap
      const scrollAmount = cardWidth * this.cardsPerView; // التحرك 3 كروت في كل مرة
      
      // حساب العدد الإجمالي للمجموعات
      const totalGroups = Math.ceil(this.services.length / this.cardsPerView);
      
      // الانتقال للمجموعة التالية
      this.currentSlideIndex++;
      
      // إذا وصلنا للنهاية، نرجع للبداية
      if (this.currentSlideIndex >= totalGroups) {
        this.currentSlideIndex = 0;
        console.log('Resetting services slider to beginning');
        container.scrollTo({
          left: this.selectedLang === 'ar' ? container.scrollWidth - container.clientWidth : 0,
          behavior: 'smooth'
        });
      } else {
        // الانتقال للمجموعة التالية (3 كروت)
        console.log(`Scrolling to group ${this.currentSlideIndex + 1} of ${totalGroups}`);
        const targetScroll = this.currentSlideIndex * scrollAmount;
        container.scrollTo({
          left: this.selectedLang === 'ar' ? -(targetScroll) : targetScroll,
          behavior: 'smooth'
        });
      }
    }
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
        
        // Start auto-slide after services are loaded
        if (this.services.length > this.cardsPerView) {
          setTimeout(() => {
            this.startAutoSlide();
          }, 1000);
        }
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
      const cardWidth = 320 + 16; // card width + gap
      const scrollAmount = cardWidth * this.cardsPerView; // التحرك 3 كروت
      
      // إيقاف التحرك التلقائي مؤقتاً عند الضغط اليدوي
      this.stopAutoSlide();
      
      container.scrollBy({
        left: this.selectedLang === 'ar' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
      
      // إعادة تشغيل التحرك التلقائي بعد 5 ثواني
      setTimeout(() => {
        this.startAutoSlide();
      }, 5000);
    }
  }

  slideRight() {
    if (this.sliderContainer) {
      const container = this.sliderContainer.nativeElement;
      const cardWidth = 320 + 16; // card width + gap
      const scrollAmount = cardWidth * this.cardsPerView; // التحرك 3 كروت
      
      // إيقاف التحرك التلقائي مؤقتاً عند الضغط اليدوي
      this.stopAutoSlide();
      
      container.scrollBy({
        left: this.selectedLang === 'ar' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      
      // إعادة تشغيل التحرك التلقائي بعد 5 ثواني
      setTimeout(() => {
        this.startAutoSlide();
      }, 5000);
    }
  }

  canScrollLeft(): boolean {
    if (!this.sliderContainer) return false;
    const container = this.sliderContainer.nativeElement;
    return this.selectedLang === 'ar' 
      ? container.scrollLeft < (container.scrollWidth - container.clientWidth)
      : container.scrollLeft > 0;
  }

  canScrollRight(): boolean {
    if (!this.sliderContainer) return false;
    const container = this.sliderContainer.nativeElement;
    return this.selectedLang === 'ar'
      ? container.scrollLeft > 0
      : container.scrollLeft < (container.scrollWidth - container.clientWidth);
  }
}
