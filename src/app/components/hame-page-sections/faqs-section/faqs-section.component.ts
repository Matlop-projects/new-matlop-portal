import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output, output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToasterService } from '../../../services/toaster.service';
import { PanelModule } from 'primeng/panel';
import { LanguageService } from '../../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginSignalUserDataService } from '../../../services/login-signal-user-data.service';

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
  paginatedFaqsList: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  Math = Math; // Make Math available in template
  api = inject(ApiService);
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  userDataService = inject(LoginSignalUserDataService);
  selectedLang = this.languageService.translationService.currentLang;


  ngOnInit(): void {
    this.getFaqsList();
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang
    });
  }

  getFaqsList() {
    const countryId = this.userDataService.getCountryId();
    this.api.get(`FAQs/GetByCountryId/${countryId}`).subscribe((res: any) => {
      console.log(res);
      this.faqsList = res.data;
      this.totalPages = Math.ceil(this.faqsList.length / this.itemsPerPage);
      this.updatePaginatedList();
      this.value.emit(this.faqsList)
    })
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFaqsList = this.faqsList.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

}
