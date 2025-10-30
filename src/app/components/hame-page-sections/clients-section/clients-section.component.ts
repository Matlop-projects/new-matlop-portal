import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { environment } from '../../../../environments/environment';
import { Subscription, interval } from 'rxjs';

interface Client {
  clientId: number;
  enName: string;
  arName: string;
  imageAr: string | null;
  imageEn: string | null;
  displayName?: string;
  displayImage?: string;
}

@Component({
  selector: 'app-clients-section',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './clients-section.component.html',
  styleUrl: './clients-section.component.scss'
})
export class ClientsSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sliderContainer', { static: false }) sliderContainer!: ElementRef;
  
  clients: Client[] = [];
  isLoading = true;
  selectedLang: string = 'ar';
  imageUrl = environment.baseImageUrl;

  private apiService = inject(ApiService);
  private languageService = inject(LanguageService);
  
  // Auto-slide properties
  private autoSlideSubscription?: Subscription;
  private autoSlideInterval = 4000; // 4 seconds for clients (slower than services)
  private currentSlideIndex = 0;
  private logosPerView = 5; // عرض 5 لوجوهات في كل مرة

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.getAllClients();
    
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
      this.updateClientsDisplay();
    });
  }

  ngAfterViewInit(): void {
    // Start auto-slide after view is initialized
    if (this.clients?.length > this.logosPerView) {
      setTimeout(() => {
        this.startAutoSlide();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    if (this.clients?.length > this.logosPerView) {
      console.log('Starting auto-slide for clients with', this.clients.length, 'items');
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
    if (this.sliderContainer && this.clients?.length > this.logosPerView) {
      const container = this.sliderContainer.nativeElement;
      const logoWidth = 200 + 20; // logo width + gap
      const scrollAmount = logoWidth * this.logosPerView; // التحرك 5 لوجوهات في كل مرة
      
      // حساب العدد الإجمالي للمجموعات
      const totalGroups = Math.ceil(this.clients.length / this.logosPerView);
      
      // الانتقال للمجموعة التالية
      this.currentSlideIndex++;
      
      // إذا وصلنا للنهاية، نرجع للبداية
      if (this.currentSlideIndex >= totalGroups) {
        this.currentSlideIndex = 0;
        console.log('Resetting clients slider to beginning');
        container.scrollTo({
          left: this.selectedLang === 'ar' ? container.scrollWidth - container.clientWidth : 0,
          behavior: 'smooth'
        });
      } else {
        // الانتقال للمجموعة التالية (5 لوجوهات)
        console.log(`Scrolling to group ${this.currentSlideIndex + 1} of ${totalGroups}`);
        const targetScroll = this.currentSlideIndex * scrollAmount;
        container.scrollTo({
          left: this.selectedLang === 'ar' ? -(targetScroll) : targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }

  slideLeft(): void {
    if (this.sliderContainer) {
      const container = this.sliderContainer.nativeElement;
      const logoWidth = 200 + 20; // logo width + gap
      const scrollAmount = logoWidth * this.logosPerView; // التحرك 5 لوجوهات
      
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

  slideRight(): void {
    if (this.sliderContainer) {
      const container = this.sliderContainer.nativeElement;
      const logoWidth = 200 + 20; // logo width + gap
      const scrollAmount = logoWidth * this.logosPerView; // التحرك 5 لوجوهات
      
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

  getAllClients(): void {
    this.isLoading = true;
    this.apiService.get('OurClients/GetAllOurClient').subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.clients = res.data.map((client: any) => ({
            clientId: client.clientId,
            enName: client.enName,
            arName: client.arName,
            imageAr: client.imageAr,
            imageEn: client.imageEn,
            displayName: this.selectedLang === 'ar' ? client.arName : client.enName,
            displayImage: this.getClientImage(client)
          }));
          
          // Start auto-slide after clients are loaded
          if (this.clients.length > this.logosPerView) {
            setTimeout(() => {
              this.startAutoSlide();
            }, 1000);
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
        this.isLoading = false;
      }
    });
  }

  private getClientImage(client: any): string {
    const imagePath = this.selectedLang === 'ar' ? client.imageAr : client.imageEn;
    if (imagePath) {
      return `${this.imageUrl}${imagePath}`;
    }
    return 'assets/img/placeholder-logo.svg';
  }

  private updateClientsDisplay(): void {
    this.clients = this.clients.map(client => ({
      ...client,
      displayName: this.selectedLang === 'ar' ? client.arName : client.enName,
      displayImage: this.getClientImage(client)
    }));
  }

  trackByClientId(index: number, client: Client): number {
    return client.clientId;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/placeholder-logo.svg';
  }
}
