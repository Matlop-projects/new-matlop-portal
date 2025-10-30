import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { SliderService, SliderItem } from "../../../services/slider.service";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-slider-section",
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: "./slider-section.component.html",
  styleUrl: "./slider-section.component.scss",
})
export class SliderSectionComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private sliderService = inject(SliderService);
  private translateService = inject(TranslateService);
  
  sliders: SliderItem[] = [];
  currentSlideIndex = 0;
  selectedLang: string = 'en';
  isLoading = false;
  private autoSlideSubscription?: Subscription;
  private dataSubscription?: Subscription;
  
  ngOnInit() {
    this.selectedLang = this.translateService.currentLang || 'en';
    this.loadSliders();
    this.startAutoSlide();
    
    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(() => {
      this.selectedLang = this.translateService.currentLang || 'en';
    });
  }
  
  ngOnDestroy() {
    this.autoSlideSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
  }
  
  loadSliders() {
    // First, check if we have cached data and use it immediately
    const cachedSliders = this.sliderService.getCachedSliders();
    if (cachedSliders.length > 0) {
      this.sliders = cachedSliders;
      this.isLoading = false; // Don't show loader if we have cached data
    } else {
      // Only show loading if we don't have any cached data
      this.isLoading = true;
    }

    // Subscribe to loading state
    this.dataSubscription = this.sliderService.loading$
      .subscribe(loading => {
        // Only update loading state if we don't already have cached data displayed
        if (this.sliders.length === 0 || loading === false) {
          this.isLoading = loading;
        }
      });

    // Subscribe to slider updates (this will get both cached and fresh data)
    this.sliderService.sliders$
      .subscribe(response => {
        if (response && response.data) {
          this.sliders = response.data.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
          this.isLoading = false; // Ensure loading is false when data is received
        }
      });

    // Use the optimized method that handles cache intelligently
    this.sliderService.getSlidersOptimized().subscribe({
      next: (response: any) => {
        if (response.code === 0 && response.data) {
          this.sliders = response.data.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Error loading sliders:', error);
        this.isLoading = false;
        // Keep existing cached data if available
      }
    });
  }
  
  startAutoSlide() {
    this.autoSlideSubscription = interval(5000).subscribe(() => {
      this.nextSlide();
    });
  }
  
  nextSlide() {
    if (this.sliders.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.sliders.length;
    }
  }
  
  prevSlide() {
    if (this.sliders.length > 0) {
      this.currentSlideIndex = this.currentSlideIndex === 0 
        ? this.sliders.length - 1 
        : this.currentSlideIndex - 1;
    }
  }
  
  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }
  
  getCurrentSlider(): SliderItem | null {
    return this.sliders.length > 0 ? this.sliders[this.currentSlideIndex] : null;
  }
  
  getCurrentImage(): string {
    const currentSlider = this.getCurrentSlider();
    // if (!currentSlider) return '/assets/images/backgrounds/test.jpg';
    
    const currentLang = this.translateService.currentLang || 'en';
    const baseUrl = 'https://backend.matlop.com';
    
    return currentLang === 'ar' 
      ? baseUrl + currentSlider?.imageAr 
      : baseUrl + currentSlider?.imageEn;
  }
  
  getCurrentTitle(): string {
    const currentSlider = this.getCurrentSlider();
    if (!currentSlider) return '';
    
    const currentLang = this.translateService.currentLang || 'en';
    return currentLang === 'ar' ? currentSlider.titleAr : currentSlider.titleEn;
  }
  
  onClickOrder() {
    this.router.navigateByUrl("services-list");
  }
  
  onClickDownload(app: string) {
    if (app === "apple") {
      window.open("https://play.google.com/store/apps/details?id=com.matlop.service&pcampaignid=web_share", "_blank");
    } else if (app === "google") {
      window.open("https://play.google.com/store/apps/details?id=com.matlop.service&pcampaignid=web_share", "_blank");
    }
  }

  // Method to manually refresh sliders
  refreshSliders(): void {
    this.sliderService.refreshSliders().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.sliders = response.data.sort((a, b) => a.displayOrder - b.displayOrder);
        }
      },
      error: (error) => {
        console.error('Error refreshing sliders:', error);
      }
    });
  }
}
