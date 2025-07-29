import { Component, EventEmitter, inject, OnInit, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-order-cancel',
  standalone: true,
  imports: [RadioButtonModule, FormsModule,TranslatePipe],
  providers: [DynamicDialogRef],
  templateUrl: './order-cancel.component.html',
  styleUrl: './order-cancel.component.scss'
})
export class OrderCancelComponent {
  @Output() confirmOrder: any = new EventEmitter();
  checked = 0;
  orderCancelationNotes = '';
  private apiServices = inject(ApiService);
  private route = inject(ActivatedRoute);
  private dialogRef = inject(DynamicDialogRef);

  onConfirm() {
    this.apiServices
      .put('Order/CancelOrder', {
        orderId: Number(this.route.snapshot.paramMap.get('id')),
        cancelReasonId: this.checked,
        orderCancelationNotes: this.orderCancelationNotes,
      })
      .subscribe((res) => {
        if (res) this.confirmOrder.emit('success');
      });
  }
}

