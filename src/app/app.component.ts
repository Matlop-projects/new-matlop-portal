import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToasterService } from './services/toaster.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';
import { ConfirmMsgService } from './services/confirm-msg.service';
import { LanguageService } from './services/language.service';
import { WhatsappFloatComponent } from './shared/whatsapp-float/whatsapp-float.component';
import { CacheManagerService } from './services/cache-manager.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, FormsModule, TranslateModule, ToastModule, Toast, WhatsappFloatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ToasterService, PrimeNG, ConfirmMsgService, ConfirmationService],
})



export class AppComponent implements OnInit, OnDestroy {
 selectedLang: any;
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  cacheManager = inject(CacheManagerService);

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    });

    // Initialize cache management system
    this.cacheManager.initialize();
  }

  ngOnDestroy(): void {
    // Cleanup cache management
    this.cacheManager.destroy();
  }

}
