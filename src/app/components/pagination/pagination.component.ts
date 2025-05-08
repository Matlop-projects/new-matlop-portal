import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { PaginatorModule } from 'primeng/paginator';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [PaginatorModule, NgClass, NgIf],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() totalCount: number = 0;
  @Input() rows: number = 8;
  @Output() onPageChange: EventEmitter<number> = new EventEmitter<number>();

  isArabic: boolean = false;

  onPage(event: any): void {
    let pageNum = 1;
    pageNum = (event.first / this.rows);
    this.onPageChange.emit(pageNum);
  }


  constructor(private languageService: LanguageService) { }

  lang:any = localStorage.getItem('lang');


  ngOnInit() {
    this.lang = this.languageService.translationService.currentLang;

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.lang = this.languageService.translationService.currentLang;
    });
    this.isArabic = this.lang === 'ar';
  }

}
