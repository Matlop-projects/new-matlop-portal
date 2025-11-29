import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from './language.service';

// interface User {
//   username: string;
//   email: string;
//   mobile: string;
//   name: string | null;
// }

@Injectable({
  providedIn: 'root',
})
export class LoginSignalUserDataService {
  // ✅ Inject LanguageService
  private languageService = inject(LanguageService);
  
  // ✅ Load user from localStorage or set it to null
  user = signal<any | null>(this.loadUserFromStorage());
  
  // ✅ Store selected country
  selectedCountry = signal<string>(this.loadCountryFromStorage());

  setUser(userData: any) {
    console.log('Setting user:', userData);
    this.user.set(userData);

    // ✅ Store user in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  }

  setSelectedCountry(country: string) {
    console.log('Setting selected country:', country);
    this.selectedCountry.set(country);
    localStorage.setItem('selectedCountry', country);
  }

  getCountryId(): number {
    const country = this.selectedCountry();
    return country === 'SA' ? 1 : country === 'OM' ? 2 : 1; // Default to Saudi Arabia
  }

  getCurrencyCode(): string {
    const country = this.selectedCountry();
    const currentLang = this.languageService.translationService.currentLang || 'ar';
    
    if (currentLang === 'ar') {
      return country === 'OM' ? 'ریال عماني' : 'ریال سعودي';
    } else {
      return country === 'OM' ? 'OMR' : 'SAR';
    }
  }

  logout() {
    this.user.set(null);
    this.selectedCountry.set('SA'); // Reset to default
    this.cache = null;
    this.currentRequest = null;
    localStorage.removeItem('user'); // ✅ Remove from localStorage on logout
    localStorage.removeItem('selectedCountry');
    localStorage.removeItem('sliders_cache');
    this.slidersSubject.next(null);
  }

  // ✅ Load user from localStorage (helper function)
  private loadUserFromStorage(): any | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // ✅ Load country from localStorage (helper function)
  private loadCountryFromStorage(): string {
    return localStorage.getItem('selectedCountry') || 'SA';
  }
  
  cache: any = null;
  currentRequest: any = null;
  slidersSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
}
