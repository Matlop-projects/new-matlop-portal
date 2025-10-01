import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { environment } from '../../../../environments/environment';

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
export class ClientsSectionComponent implements OnInit {
  clients: Client[] = [];
  isLoading = true;
  selectedLang: string = 'ar';
  imageUrl = environment.baseImageUrl;

  private apiService = inject(ApiService);
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.getAllClients();
    
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
      this.updateClientsDisplay();
    });
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
      // The API returns paths like "/Images/OurClients/filename.png"
      // We need to create "https://backend.matlop.com/Images/OurClients/filename.png"
      // Remove leading slash and combine with base URL
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      return `${this.imageUrl}/${cleanPath}`;
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
