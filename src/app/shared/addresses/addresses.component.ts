import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Select } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ApiService } from '../../services/api.service';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../components/background-image-with-text/background-image-with-text.component';
import { LanguageService } from '../../services/language.service';
import { MapComponent } from '../../components/map/map.component';

interface Address {
  locationId: number;
  countryId: number;
  cityId: number;
  countryName: string;
  cityName: string;
  districtName: string;
  districtId: number;
  blockNo: string;
  latitude?: string;
  longitude?: string;
  name: string;
  userId: number;
}

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, BackgroundImageWithTextComponent, Select, FloatLabelModule, MapComponent],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
    languageService = inject(LanguageService)
    bkg_text_options: IBackGroundImageWithText = {
    imageUrl: 'assets/img/slider.svg',
    header: this.languageService.translate('ADDRESSES.TITLE'),
    description: this.languageService.translate('ADDRESSES.NO_ADDRESSES_DESC'),
    style: {
      padding: "70px 0 0 0"
    }
  };

  addresses: Address[] = [];
  isLoading = false;
  showModal = false;
  isEditMode = false;
  selectedAddress: Address | null = null;
  addressForm: FormGroup;
  
  // Dropdown lists
  countryList: any[] = [];
  cityList: any[] = [];
  districtList: any[] = [];
  currentLang = this.languageService.translationService.currentLang;

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  constructor() {
    this.addressForm = this.fb.group({
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      districtId: ['', Validators.required],
      blockNo: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      name: ['']
    });
  }

  ngOnInit() {
    this.loadAddresses();
    this.getAllCountry();
  }

  // Dropdown methods
  getAllCountry() {
    this.apiService.get('Country/GetAll').subscribe((res: any) => {
      if (res.data) {
        this.countryList = [];
        res.data.map((item: any) => {
          this.countryList.push({
            name: this.currentLang == 'en' ? item.enName : item.arName,
            code: item.countryId,
            selected: false,
          });
        });
      }
    });
  }

  getAllCity(countryId: number) {
    this.apiService
      .get('city/GetByCountryId/' + countryId)
      .subscribe((res: any) => {
        if (res.data) {
          this.cityList = [];
          res.data.map((item: any) => {
            this.cityList.push({
              name: this.currentLang == 'en' ? item.enName : item.arName,
              code: item.cityId,
              selected: false,
            });
          });
        }
      });
  }

  getAllDistrict(cityId: number) {
    this.apiService
      .get('district/GetByCityId', { CityId: cityId })
      .subscribe((res: any) => {
        if (res.data) {
          this.districtList = [];
          res.data.map((item: any) => {
            this.districtList.push({
              name: this.currentLang == 'en' ? item.enName : item.arName,
              code: item.districtId,
              selected: false,
            });
          });
        }
      });
  }

  onCountrySelect(item: any) {
    const payload = item.code ?? item;
    this.getAllCity(payload);
    // Reset city and district when country changes
    this.addressForm.patchValue({
      cityId: '',
      districtId: ''
    });
    this.cityList = [];
    this.districtList = [];
  }

  onCitySelect(item: any) {
    const payload = item.code ?? item;
    this.getAllDistrict(payload);
    // Reset district when city changes
    this.addressForm.patchValue({
      districtId: ''
    });
    this.districtList = [];
  }

  loadAddresses() {
    this.isLoading = true;
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      this.apiService.getAddressesByUserId(parseInt(userId)).subscribe({
        next: (response) => {
          this.addresses = response.data || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading addresses:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedAddress = null;
    this.addressForm.reset();
    this.showModal = true;
  }

  openEditModal(address: Address) {
    this.isEditMode = true;
    this.selectedAddress = address;
    this.showModal = true;
    
    // Load dropdowns data for editing
    if (address.countryId) {
      this.getAllCity(address.countryId);
    }
    if (address.countryId && address.cityId) {
      // Wait a bit for cities to load, then load districts
      setTimeout(() => {
        this.getAllDistrict(address.cityId);
      }, 500);
    }
    
    // Set form values after loading dropdowns
    setTimeout(() => {
      this.addressForm.patchValue(address);
    }, 600);
  }

  closeModal() {
    this.showModal = false;
    this.addressForm.reset();
    this.selectedAddress = null;
  }

  onOverlayClick(event: Event) {
    // Only close modal if clicking directly on the overlay, not on child elements
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  saveAddress() {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      const userId = localStorage.getItem('userId');
      
      if (this.isEditMode && this.selectedAddress) {
        this.updateAddress({ ...formData, locationId: this.selectedAddress.locationId,userId: parseInt(userId || '0') });
      } else {
        this.createAddress(formData);
      }
    }
  }

  createAddress(addressData: any) {
    const userId = localStorage.getItem('userId');
    const payload = {
      ...addressData,
      userId: parseInt(userId || '0')
    };

    this.apiService.createAddress(payload).subscribe({
      next: (response) => {
        console.log('Address created successfully:', response);
        this.loadAddresses();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating address:', error);
      }
    });
  }

  updateAddress(addressData: any) {
    this.apiService.updateAddress(addressData).subscribe({
      next: (response) => {
        debugger;
        console.log('Address updated successfully:', response);
        this.loadAddresses();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating address:', error);
      }
    });
  }

  deleteAddress(addressId: number) {
    if (confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
      this.apiService.deleteAddress(addressId).subscribe({
        next: (response) => {
          console.log('Address deleted successfully:', response);
          this.loadAddresses();
        },
        error: (error) => {
          console.error('Error deleting address:', error);
        }
      });
    }
  }

  // Handle location change from map component
  onLocationChange(location: { lat: number, lng: number }) {
    // Update form controls when map location changes
    this.addressForm.patchValue({
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6)
    });
  }
}
