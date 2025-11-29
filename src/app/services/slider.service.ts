import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { LoginSignalUserDataService } from './login-signal-user-data.service';

export interface SliderItem {
  sliderId: number;
  imageEn: string;
  imageAr: string;
  titleEn: string;
  titleAr: string;
  displayOrder: number;
  viewType: number;
}

export interface SliderResponse {
  code: number;
  message: string;
  data: SliderItem[];
}

interface CacheEntry {
  data: SliderResponse;
  timestamp: number;
  countryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private baseApiUrl = 'https://backend.matlop.com/api/Slider';
  private cache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // BehaviorSubject to emit cached data immediately
  private slidersSubject = new BehaviorSubject<SliderResponse | null>(null);
  public sliders$ = this.slidersSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  private userDataService = inject(LoginSignalUserDataService);

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
    
    // If we have cached data, emit it immediately to the BehaviorSubject
    if (this.cache && this.cache.data) {
      this.slidersSubject.next(this.cache.data);
    }
  }

  private currentRequest: Observable<SliderResponse> | null = null;

  getSliders(forceRefresh: boolean = false): Observable<SliderResponse> {
    if (!forceRefresh && this.isValidCache()) {
      if (this.slidersSubject.value !== this.cache!.data) {
        this.slidersSubject.next(this.cache!.data);
      }
      this.loadingSubject.next(false);
      return of(this.cache!.data);
    }

    if (this.currentRequest && !forceRefresh) {
      return this.currentRequest;
    }

    if (this.cache && !forceRefresh) {
      this.slidersSubject.next(this.cache.data);
    }

    this.loadingSubject.next(true);
    const countryId = this.userDataService.getCountryId();
    const apiUrl = `${this.baseApiUrl}/GetByCountryId/${countryId}`;

    this.currentRequest = this.http.get<SliderResponse>(apiUrl).pipe(
      tap(response => {
        this.cache = {
          data: response,
          timestamp: Date.now(),
          countryId: countryId
        };
        
        this.saveToLocalStorage();
        
        this.slidersSubject.next(response);
        
        this.loadingSubject.next(false);
        
        this.currentRequest = null;
      }),
      catchError(error => {
        console.error('Error fetching sliders:', error);
        this.loadingSubject.next(false);
        this.currentRequest = null;
        
        // If we have cached data, return it as fallback
        if (this.cache) {
          this.slidersSubject.next(this.cache.data);
          return of(this.cache.data);
        }
        
        throw error;
      }),
      shareReplay(1)
    );

    return this.currentRequest;
  }

  getSlidersOptimized(): Observable<SliderResponse> {
    if (this.isValidCache()) {
      if (this.slidersSubject.value !== this.cache!.data) {
        this.slidersSubject.next(this.cache!.data);
      }
      this.loadingSubject.next(false);
      return of(this.cache!.data);
    }

    if (this.cache) {
      this.slidersSubject.next(this.cache.data);
      
      this.loadingSubject.next(true);
      
      this.getSliders(true).subscribe({
        next: () => {
          this.loadingSubject.next(false);
        },
        error: () => {
          this.loadingSubject.next(false);
        }
      });
      
      // Return cached data immediately without loader
      return of(this.cache.data);
    }

    // No cache available, show loader and fetch fresh data
    this.loadingSubject.next(true);
    this.slidersSubject.next(null);
    return this.getSliders(false);
  }

  // Get cached sliders immediately (synchronous)
  getCachedSliders(): SliderItem[] {
    return this.cache?.data?.data || [];
  }

  // Check if we have valid cached data (public method for external use)
  hasValidCache(): boolean {
    return this.isValidCache();
  }

  // Check if cache is valid
  private isValidCache(): boolean {
    if (!this.cache) return false;
    const now = Date.now();
    const currentCountryId = this.userDataService.getCountryId();
    return (now - this.cache.timestamp) < this.CACHE_DURATION && this.cache.countryId === currentCountryId;
  }

  // Clear cache
  clearCache(): void {
    this.cache = null;
    this.currentRequest = null;
    localStorage.removeItem('sliders_cache');
    this.slidersSubject.next(null);
  }

  // Force refresh data
  refreshSliders(): Observable<SliderResponse> {
    return this.getSliders(true);
  }

  // Save cache to localStorage
  private saveToLocalStorage(): void {
    if (this.cache) {
      try {
        localStorage.setItem('sliders_cache', JSON.stringify(this.cache));
      } catch (error) {
        console.warn('Failed to save sliders cache to localStorage:', error);
      }
    }
  }

  // Load cache from localStorage
  private loadFromLocalStorage(): void {
    try {
      const cached = localStorage.getItem('sliders_cache');
      if (cached) {
        const parsedCache: CacheEntry = JSON.parse(cached);
        
        // Check if the cached data is not too old (extend to 24 hours for localStorage)
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        const currentCountryId = this.userDataService.getCountryId();
        
        if ((now - parsedCache.timestamp) < maxAge && parsedCache.countryId === currentCountryId) {
          this.cache = parsedCache;
          this.slidersSubject.next(parsedCache.data);
        } else {
          // Remove expired or mismatched country cache
          localStorage.removeItem('sliders_cache');
          this.slidersSubject.next(null);
        }
      }
    } catch (error) {
      console.warn('Failed to load sliders cache from localStorage:', error);
      localStorage.removeItem('sliders_cache');
    }
  }
}