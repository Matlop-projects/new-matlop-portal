import { Component, EventEmitter, inject, Output, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Select } from 'primeng/select';
import { LanguageService } from '../../services/language.service';
import { ApiService } from '../../services/api.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-add-location',
  standalone: true,
  imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule,
        FloatLabelModule,
        Select,
        MapComponent,
  ],
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.scss'
})
export class AddLocationComponent implements OnInit, AfterViewInit {
  @Output()value:any =new EventEmitter()
  @ViewChild(MapComponent) mapComponent?: MapComponent;
  
 private apiService = inject(ApiService);
  private router = inject(Router);
  private lang = inject(LanguageService);
  countryPlac = '';
  currentLang = this.lang.translationService.currentLang;
  countryList: any[] = [];
  cityList: any[] = [];
  districtList: any[] = [];
  
  form = new FormGroup({
    userId: new FormControl(0),
    blockNo: new FormControl('', {
      validators: [Validators.required],
    }),
    latitude: new FormControl(24.7136), // Default Riyadh coordinates
    longitude: new FormControl(46.6753), // Default Riyadh coordinates
    name: new FormControl(''),
    locationId: new FormControl(''),
    cityId: new FormControl<any>('',Validators.required),
    countryId: new FormControl<any>('',Validators.required),
    districtId: new FormControl<any>(null),
  });


  ngOnInit() {
    this.getAllCountry();
  }

  ngAfterViewInit() {
    // Ensure the component is fully rendered before any map initialization
    // This is especially important when used in popups or dynamic components
    // Add a small delay to ensure the dialog is fully opened and sized
    setTimeout(() => {
      this.refreshMap();
    }, 300);
  }

  // Public method to refresh map - can be called from parent when dialog opens
  refreshMap() {
    if (this.mapComponent) {
      setTimeout(() => {
        this.mapComponent?.refreshMapSize();
        console.log('Map size invalidated and refreshed');
      }, 100);
    }
  }

  onLocationChange(location: { lat: number, lng: number }) {
    // Update form controls when map location changes
    this.form.patchValue({
      latitude: parseFloat(location.lat.toFixed(6)),
      longitude: parseFloat(location.lng.toFixed(6))
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
    console.log('LocationDetailsComponent  onCountrySelect  item:', item);
    const payload=item.code??item
    this.getAllCity(payload);
  }

  onCitySelect(item: any) {
    const payload=item.code??item
    //this.getAllDistrict(payload);
  }

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

  getLocationById(locationId: string) {
    this.apiService
      .get('Location/GetById/' + locationId)
      .subscribe((res: any) => {
        if (res) {
          this.form.patchValue({
            ...res.data,
          });
          if (res.data.countryId) {
            this.onCountrySelect({ code: res.data.countryId });
          }
          if (res.data.countryId && res.data.cityId) {
            this.onCitySelect({ code: res.data.cityId });
          }
        }
      });
  }

  onSubmit() {
    let payload = {
      ...this.form.value,
      latitude: this.form.value.latitude?.toString() || '24.7136',
      locationId: 0,
      longitude: this.form.value.longitude?.toString() || '46.6753',
      name: 'asd',
      userId: localStorage.getItem('userId'),
    };
    this.value.emit(payload)
  //  this.addLocation();
  }
}
