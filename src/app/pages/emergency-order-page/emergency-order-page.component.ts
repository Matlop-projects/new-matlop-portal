import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-emergency-order-page',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgClass,Dialog,FormsModule,TranslatePipe,InputTextModule,NgFor],
  templateUrl: './emergency-order-page.component.html',
  styleUrl: './emergency-order-page.component.scss'
})
export class EmergencyOrderPageComponent {
  api = inject(ApiService);
  languageService = inject(LanguageService);
  selectedLang = this.languageService.translationService.currentLang;
  showAddSpecialOrder:boolean=false

  route = inject(ActivatedRoute);
  router = inject(Router)
  orders: any;
  clientId: any;
  SpecialOrderEnum: any;
  currentLang = this.languageService.translationService.currentLang;
  stateOptions: any[]=[]
  defaultStatus: any;
  locations: any;
  form = new FormGroup({
    clientId: new FormControl(localStorage.getItem('userId')),
    specialOrderId: new FormControl(0),
    amount: new FormControl(0),
    locationId: new FormControl('',Validators.required),
    specialOrderDate: new FormControl<any>(null),
    notes: new FormControl(''),
    specialOrderEnum: new FormControl(0),
    specialOrderStatus: new FormControl(1),
    media: new FormControl<any[]>([])
  });

  createEmergencyOrder(payload:any){
    this.api.post('SpecialOrder/Create',payload).subscribe(res=>{
    })
  }

  getLocation() {
    const userId = localStorage.getItem('userId')
    this.api.get('Location/GetByUserId/' + userId).subscribe((res: any) => {
      if (res.data) {
        this.locations = []
        res.data.map((item: any) => {
          this.locations.push({
            name: item.countryName,
            code: item.locationId,
          })
        })
      }
    })
  }
}
