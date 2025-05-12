import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-order-cancel',
  standalone: true,
  imports: [CheckboxModule,FormsModule],
  providers:[DynamicDialogRef],
  templateUrl: './order-cancel.component.html',
  styleUrl: './order-cancel.component.scss'
})
export class OrderCancelComponent {
checked=0
orderCancelationNotes=''
private apiServices=inject(ApiService)
private route =inject(ActivatedRoute)
private dialogRef=inject(DynamicDialogRef)

onChecked(data:number){
  console.log('ggg',data)
this.checked=data
}
onConfirm(){
 
  this.apiServices.put('Order/CancelOrder',{
     "orderId": Number(this.route.snapshot.paramMap.get('id')),
  "cancelReasonId": this.checked,
  "orderCancelationNotes": this.orderCancelationNotes
  }).subscribe(res=>{
    
    this.dialogRef.close();  
  })
 
}
}
