import { Injectable } from '@angular/core';
import { SliderService } from './slider.service';
import { environment } from '../../environments/environment';

export interface CacheConfig {
  key: string;
  maxAge: number; // in milliseconds
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class CacheManagerService {
  private refreshTimers: Map<string, any> = new Map();

  constructor(private sliderService: SliderService) {}

  // Setup auto-refresh for sliders
  setupSliderAutoRefresh(intervalMinutes: number = 30): void {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    // Clear existing timer if any
    this.clearAutoRefresh('sliders');
    
    // Set new timer
    const timer = setInterval(() => {
      if (!this.sliderService.hasValidCache()) {
        this.sliderService.refreshSliders().subscribe({
          next: () => {
            if (!environment.production) {
              console.log('Sliders cache auto-refreshed successfully');
            }
          },
          error: (error) => console.error('Failed to auto-refresh sliders cache:', error)
        });
      }
    }, intervalMs);
    
    this.refreshTimers.set('sliders', timer);
  }

  // Clear auto-refresh for a specific cache
  clearAutoRefresh(cacheKey: string): void {
    const timer = this.refreshTimers.get(cacheKey);
    if (timer) {
      clearInterval(timer);
      this.refreshTimers.delete(cacheKey);
    }
  }

  // Clear all auto-refresh timers
  clearAllAutoRefresh(): void {
    this.refreshTimers.forEach((timer) => clearInterval(timer));
    this.refreshTimers.clear();
  }

  // Manual cache refresh for sliders
  refreshSlidersCache(): void {
    // Check if we have valid cached data before forcing a refresh
    if (!this.sliderService.hasValidCache()) {
      this.sliderService.refreshSliders().subscribe({
        next: () => {
          // Only log in development mode
          if (!environment.production) {
            console.log('Sliders cache refreshed successfully');
          }
        },
        error: (error) => console.error('Failed to refresh sliders cache:', error)
      });
    }
    // Removed the "skipped" log to reduce console noise
  }

  // Clear sliders cache
  clearSlidersCache(): void {
    this.sliderService.clearCache();
  }

  // Check if it's time to refresh cache based on user activity
  checkAndRefreshOnUserActivity(): void {
    // Refresh cache when user becomes active after being idle (only if cache is expired)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // User is back, check if cache needs refresh only if it's expired
        this.refreshSlidersIfNeeded();
      }
    });

    // Refresh cache on focus (when user returns to tab) only if cache is expired
    window.addEventListener('focus', () => {
      this.refreshSlidersIfNeeded();
    });
  }

  // Helper method to refresh sliders only if cache is expired or invalid
  private refreshSlidersIfNeeded(): void {
    // Check if sliders cache is still valid before refreshing
    if (!this.sliderService.hasValidCache()) {
      this.sliderService.refreshSliders().subscribe({
        next: () => {
          if (!environment.production) {
            console.log('Sliders cache refreshed successfully');
          }
        },
        error: (error) => console.error('Failed to refresh sliders cache:', error)
      });
    }
    // Removed console logs to reduce noise during navigation
  }

  // Initialize cache management
  initialize(): void {
    // Setup auto-refresh every 30 minutes
    this.setupSliderAutoRefresh(30);
    
    // Setup user activity based refresh
    this.checkAndRefreshOnUserActivity();
  }

  // Cleanup on service destroy
  destroy(): void {
    this.clearAllAutoRefresh();
  }
}