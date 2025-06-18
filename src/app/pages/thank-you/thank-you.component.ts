import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [NgClass, NgIf, TranslatePipe],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent implements OnInit {
  isSuccess: boolean = true;
  queryParams: any;  // Variable to hold query parameters
  apiService = inject(ApiService);
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Subscribe to query parameters and store them in queryParams
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      console.log(this.queryParams);  // Log to console or handle as needed

      // Example of how to check specific params
      if (this.queryParams['status'] === 'paid') {
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
      }

      this.callBackPayment();
    });
  }


  callBackPayment() {
    this.apiService.get(`PaymentTransaction/updateCallBack?id=${this.queryParams.id}&status=${this.queryParams.status}&amount=${this.queryParams.amount}&message=${this.queryParams.message}`).subscribe((res: any) => {
      console.log(res);
    })
  }


  goHome() {
    window.location.href = '/';
  }
}
