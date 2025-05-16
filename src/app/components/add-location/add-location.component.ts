import { Component, EventEmitter, inject, Output } from '@angular/core';
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

@Component({
  selector: 'app-add-location',
  standalone: true,
  imports: [
        ReactiveFormsModule,
        TranslatePipe,
        InputTextModule,
        FloatLabelModule,
        Select,
  ],
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.scss'
})
export class AddLocationComponent {
  @Output()value:any =new EventEmitter()
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
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    name: new FormControl(''),
    locationId: new FormControl(''),
    cityId: new FormControl<any>('',Validators.required),
    countryId: new FormControl<any>('',Validators.required),
    districtId: new FormControl<any>('',Validators.required),
  });


  ngOnInit() {
    this.getAllCountry();
    
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
    this.getAllDistrict(payload);
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
      latitude: '123',
      locationId: 0,
      longitude: '123',
      name: 'asd',
      userId: 12,
    };
    this.value.emit(payload)
  //  this.addLocation();
  }
}
