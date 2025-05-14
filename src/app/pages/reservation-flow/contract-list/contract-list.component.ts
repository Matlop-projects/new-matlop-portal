import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss'
})
export class ContractListComponent {
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  selectedLang: any;
  languageService = inject(LanguageService);
  serviceId: any;
  contractList: any;

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.params['id'];
    this.getContractListBiServiceId(this.serviceId);
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    });
  }

  getContractListBiServiceId(serviceId: string) {
    this.ApiService.get(`ContractType/GetByServiceId/${serviceId}`).subscribe((item: any) => {
      this.contractList = item.data;
    });
  }

  goPackages(contractId: string) {
    console.log(contractId);
    this.router.navigate(['/package-list' ,contractId ,this.serviceId ])
  }
}
