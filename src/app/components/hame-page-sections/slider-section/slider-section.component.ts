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
  private autoSlideSubscription?: Subscription;
  private dataSubscription?: Subscription;
  
  ngOnInit() {
    this.loadSliders();
    this.startAutoSlide();
  }
  
  ngOnDestroy() {
    this.autoSlideSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
  }
  
  loadSliders() {
    this.dataSubscription = this.sliderService.getSliders().subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.sliders = response.data.sort((a, b) => a.displayOrder - b.displayOrder);
        }
      },
      error: (error) => {
        console.error('Error loading sliders:', error);
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
}
