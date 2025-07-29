import { Component, EventEmitter, inject, OnInit, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-order-cancel',
  standalone: true,
  imports: [RadioButtonModule, FormsModule , SelectModule , TranslatePipe],
  providers: [DynamicDialogRef],
  templateUrl: './order-cancel.component.html',
  styleUrl: './order-cancel.component.scss'
})
export class OrderCancelComponent {
  @Output() confirmOrder: any = new EventEmitter();
  checked = 0;
  orderCancelationNotes = '';
  cancelReasonsList: any;
  private apiServices = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router =inject(Router)
  private dialogRef = inject(DynamicDialogRef);
  private translateService = inject(TranslateService);
  selectedReasonId: any;
  userTypeId=localStorage.getItem('userType')

ngOnInit(): void {
  this.translateService.onLangChange.subscribe(() => {
    this.getCancelReasons(); // reload reasons with correct labels
  });
  this.getCancelReasons();
}

getCancelReasons() {
  const currentLang = this.translateService.currentLang || 'ar'; // default to Arabic

  this.apiServices.get('CancelReason/GetAll',{UserTypeId:this.userTypeId}).subscribe((res: any) => {
    if (res?.data) {
      this.cancelReasonsList = res.data
        .map((item: any) => ({
          label: currentLang === 'ar' ? item.arName : item.enName,
          value: item.reasonId,
        }));
    }
  });
}

  onConfirm() {
    this.apiServices
      .put('Order/CancelOrder', {
        orderId: Number(this.route.snapshot.paramMap.get('id')),
        cancelReasonId: this.selectedReasonId.value,
        orderCancelationNotes: this.orderCancelationNotes,
      })
      .subscribe((res) => {
        if (res) {
          this.confirmOrder.emit('success');
          this.router.navigateByUrl("orders");

        }
      });
  }
}

