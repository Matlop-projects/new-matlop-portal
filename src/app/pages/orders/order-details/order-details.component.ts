import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { DialogModule } from 'primeng/dialog';
import { OrderCancelComponent } from "../order-cancel/order-cancel.component";
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [NgIf, DatePipe, NgFor, DialogModule, OrderCancelComponent],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  orderDetails:any
  visible:boolean=false
  baseUrl=environment.baseImageUrl
  private route =inject(ActivatedRoute)
  private apiService =inject(ApiService)

  get orderId(){
   return this.route.snapshot.paramMap.get('id')
  }
  ngOnInit(): void {
    this.getOrderDetails()  
  }

  getOrderDetails(){
     this.apiService.get(`order/get/${this.orderId}`).subscribe((res:any)=>{
      if(res.data)
        this.orderDetails=res.data;
      console.log(this.orderDetails)
     })
  }

  onCancelOrder(){
    this.visible=true
  }
}
