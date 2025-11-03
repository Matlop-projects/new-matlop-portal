import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { NgIf, NgFor } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../../components/background-image-with-text/background-image-with-text.component';
import { LoginSignalUserDataService } from '../../../services/login-signal-user-data.service';
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
  private userDataService = inject(LoginSignalUserDataService);
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
    // Get the country ID from user data service
    const countryId = this.userDataService.getCountryId();
    
    this.ApiService.get(`Package/GetPackageByContractIdAndServiceId/${contractId}/${serviceId}`).subscribe((item: any) => {
      console.log('All packages:', item.data);
      
      // Filter packages by countryId
      if (item.data && Array.isArray(item.data)) {
        this.packageList = item.data.filter((pkg: any) => pkg.countryId === countryId);
        console.log('Filtered packages by country:', this.packageList);
      } else {
        this.packageList = [];
      }
    });
  }

  getAllCites() {
    // Get the country ID from user data service
    const countryId = this.userDataService.getCountryId();
    
    this.ApiService.get('City/GetAll').subscribe((res: any) => {
      console.log('All cities:', res);

      // Filter cities by countryId
      const filteredCities = res.data ? res.data.filter((city: any) => city.countryId === countryId) : [];
      
      const citiesFromApi = filteredCities.map((data: any) => ({
        ...data,
        fullName: `${data.enName} - ${data.arName}`
      }));

      this.cities = [
        {
          cityId: 0,
          enName: "All",
          arName: "الكل",
          fullName: "All Cities - كل المدن"
        },
        ...citiesFromApi
      ];

      console.log('Filtered cities by country:', this.cities);
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
    // Get the country ID from user data service
    const countryId = this.userDataService.getCountryId();
    
    if(data.value.cityId) {
      ;
      this.ApiService.get(`Package/GetPackageByCityId/${data.value.cityId}/${this.contractId}/${this.serviceId}`).subscribe((res: any) => {
        console.log('Packages by city:', res);
        // Check if response data exists and is not empty
        if (res && res.data && res.data.length > 0) {
          // Filter packages by countryId
          this.packageList = res.data.filter((pkg: any) => pkg.countryId === countryId);
          localStorage.setItem('contractDetails', JSON.stringify(this.packageList));
        } else {
          // Clear the list when no data is found
          this.packageList = [];
          localStorage.removeItem('contractDetails');
        }
      }, (error) => {
        // Handle API errors by clearing the list
        console.error('Error fetching packages:', error);
        this.packageList = [];
        localStorage.removeItem('contractDetails');
      })
    } else {
      this.getPackagesListBiContractId(this.contractId, this.serviceId);
    }
  }

  /**
   * Get currency icon based on selected country
   * @returns string path to currency icon
   */
  getCurrencyIcon(): string {
    const selectedCountry = this.userDataService.getCountryId();
    return selectedCountry === 2 
      ? 'assets/images/icons-svg/Omani_Rial.svg' 
      : 'assets/images/icons-svg/Saudi_Riyal.svg';
  }
}

