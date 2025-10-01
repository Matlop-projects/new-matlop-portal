import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { NgIf, NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from "../../../components/background-image-with-text/background-image-with-text.component";

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [NgIf, NgFor, TranslatePipe, BackgroundImageWithTextComponent],
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

     bkg_text_options: IBackGroundImageWithText = {
      imageUrl: 'assets/img/slider.svg',
      header: this.languageService.translate('ABOUT_US_CONTACT.BANNER_HEADER'),
      description: this.languageService.translate('ABOUT_US_CONTACT.BANNER_DESC'),
      style: {
        padding: "70px 0 0 0"
      }
    };
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
