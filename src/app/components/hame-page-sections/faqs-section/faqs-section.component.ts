import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output, output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToasterService } from '../../../services/toaster.service';
import { PanelModule } from 'primeng/panel';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-faqs-section',
  standalone: true,
  imports: [NgIf, NgFor, PanelModule , TranslatePipe],
  templateUrl: './faqs-section.component.html',
  styleUrl: './faqs-section.component.scss'
})
export class FaqsSectionComponent {
@Output() value =new EventEmitter()
  faqsList: any[] = [];
  api = inject(ApiService);
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  selectedLang = this.languageService.translationService.currentLang;


  ngOnInit(): void {
    this.getFaqsList();
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang
    });
  }

  getFaqsList() {
    this.api.get('FAQs/GetAll').subscribe((res: any) => {
      console.log(res);
      this.faqsList = res.data;
      this.value.emit(this.faqsList)
    })
  }

}
