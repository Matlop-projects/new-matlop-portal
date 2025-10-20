import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { NgIf, NgFor } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../../components/background-image-with-text/background-image-with-text.component';
@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [NgIf, NgFor , SelectModule , FormsModule , TranslatePipe , BackgroundImageWithTextComponent],
  templateUrl: './packages-list.component.html',
  styleUrl: './packages-list.component.scss'
})
export class PackagesListComponent {

 private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  selectedLang: any;
  languageService = inject(LanguageService);
  serviceId: any;
  contractId: any;
  cities: any;

  packageList: any;

   bkg_text_options: IBackGroundImageWithText = {
      imageUrl: 'assets/img/slider.svg',
      header: this.languageService.translate('ABOUT_US_CONTACT.BANNER_HEADER'),
      description: this.languageService.translate('ABOUT_US_CONTACT.BANNER_DESC'),
      style: {
        padding: "70px 0 0 0"
      }
    };

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.params['serviceId'];
    this.contractId = this.route.snapshot.params['contractId'];
    this.getAllCites();

    this.getPackagesListBiContractId(this.contractId, this.serviceId);
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.bkg_text_options.header = this.languageService.translate('ABOUT_US_CONTACT.BANNER_HEADER');
      this.bkg_text_options.description = this.languageService.translate('ABOUT_US_CONTACT.BANNER_DESC');
    });
  }

  getPackagesListBiContractId(contractId: string, serviceId: any) {
    this.ApiService.get(`Package/GetPackageByContractIdAndServiceId/${contractId}/${serviceId}`).subscribe((item: any) => {
      console.log(item.data);
      this.packageList = item.data;

    });
  }

  getAllCites() {
    this.ApiService.get('City/GetAll').subscribe((res: any) => {
      console.log(res);

      const citiesFromApi = res.data.map((data: any) => ({
        ...data,
        fullName: `${data.enName} - ${data.arName}`
      }));

      this.cities = [
        {
          cityId: 0,
          enName: "All",
          arName: "الكل",
          fullName: "All Cites - كل المدن"
        },
        ...citiesFromApi
      ];

      console.log(this.cities);
    });
  }

  getContractListBiServiceId(serviceId: string) {
    this.ApiService.get(`ContractType/GetByServiceId/${serviceId}`).subscribe((item: any) => {
      this.packageList = item.data;
    });
  }

  goPackageDetails(packageId: string) {
    this.router.navigate(['/package-details' , packageId])
  }

  onPackagesDropdownSearch(data: any) {
    if(data.value.cityId) {
      debugger;
      this.ApiService.get(`Package/GetPackageByCityId/${data.value.cityId}/${this.contractId}/${this.serviceId}`).subscribe((res: any) => {
        console.log(res);
        this.packageList = res.data;
        localStorage.setItem('contractDetails', JSON.stringify(this.packageList));
      })
    } else {
      this.getPackagesListBiContractId(this.contractId, this.serviceId);
    }

  }
}

