import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { DatePipe, NgFor, NgIf } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { DialogModule } from "primeng/dialog";
import { OrderCancelComponent } from "../order-cancel/order-cancel.component";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-order-details",
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgFor,
    DialogModule,
    OrderCancelComponent,
    FormsModule,
  ],
  templateUrl: "./order-details.component.html",
  styleUrl: "./order-details.component.scss",
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any;
  visibleCancelOrder: boolean = false;
  visibleAdditionalItem: boolean = false;
  orderAdditionalNotes: string = "";
  baseUrl = environment.baseImageUrl;
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiService = inject(ApiService);

  get orderId() {
    return this.route.snapshot.paramMap.get("id");
  }
  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.apiService.get(`order/get/${this.orderId}`).subscribe((res: any) => {
      if (res.data) this.orderDetails = res.data;
      console.log(this.orderDetails);
    });
  }

  goToOrders() {
    this.router.navigateByUrl("orders");
  }

  onCancelOrder() {
    this.visibleCancelOrder = true;
  }
  onCloseDialogWhenConfirm(value: string) {
    this.visibleCancelOrder = false;
  }

  onAdditionalOrder() {
    this.visibleAdditionalItem = true;
  }
  confirmAdditionalItem() {
    let payload = {
      orderId: this.orderId,
      orderAddtionalItemId: 0,
      additionalPrice: 0,
      note: this.orderAdditionalNotes,
    };
    this.apiService
      .post("OrderAdditionalItems/Create", payload)
      .subscribe((res) => {
        if (res) {
          this.visibleAdditionalItem = false;
          this.getOrderDetails();
        }
      });
  }
}
