import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { DatePipe, NgFor, NgIf } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { DialogModule } from "primeng/dialog";
import { OrderCancelComponent } from "../order-cancel/order-cancel.component";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { FloatLabelModule } from "primeng/floatlabel";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "../../../services/language.service";
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
    SelectModule,
    FloatLabelModule,
    TranslateModule,
  ],
  templateUrl: "./order-details.component.html",
  styleUrl: "./order-details.component.scss",
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any;
  orderSchedule: any[]=[];
  visibleCancelOrder: boolean = false;
  visibleAdditionalItem: boolean = false;
  visiblePaymentWay: boolean = false;
  orderAdditionalNotes: string = "";
  selectedPaymentValue: any[] = [];
  baseUrl = environment.baseImageUrl;
  PaymentWayList: any[] = [];
  dateClass: string[] = [];
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiService = inject(ApiService);
  selectedLang: any;
  languageService = inject(LanguageService);
  get orderId() {
    return this.route.snapshot.paramMap.get("id");
  }
  get totalEquipmentPrice(): number {
  return this.orderDetails.orderEquipmentResponse?.reduce((sum:number, item:any) => sum + item.price, 0) || 0;
}

  ngOnInit(): void {
    this.getOrderDetails();
    this.getorderSchedule();
    this.selectedLang =
      this.languageService.translationService.currentLang || "ar";
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getOrderDetails();
      this.getorderSchedule();
    });
  }
  getorderSchedule() {
    this.apiService
      .get(`Order/GetOrderSchedule/${this.orderId}`)
      .subscribe((res: any) => {
        if (res.data) {
          this.orderSchedule = res.data;
          this.checkdateVisited(this.orderSchedule);
        }
      });
  }
  checkdateVisited(date: any) {
    const visitDate = new Date(date);
    const now = new Date();

    if (visitDate.getTime() < now.getTime()) {
      return "past-date-visit";
    } else if (visitDate.getTime() > now.getTime()) {
      return "future-date-visit";
    } else {
      return "current-date-visit";
    }
  }
  confirmPaymentWay() {
    let body = {
      paymentId: this.selectedPaymentValue[0].code,
      enName: this.selectedPaymentValue[0].en,
      arName: this.selectedPaymentValue[0].ar,
      enDescription: this.selectedPaymentValue[0].descEn,
      arDescription: this.selectedPaymentValue[0].descAr,
    };
    this.apiService
      .put("PaymentWay/UpdatePaymentWay", body)
      .subscribe((res) => {
        if (res) {
          this.visiblePaymentWay = false;
          this.getOrderDetails();
        }
      });
  }
  getOrderDetails() {
    this.apiService.get(`order/get/${this.orderId}`).subscribe((res: any) => {
      if (res.data) {
        this.orderDetails = res.data;
        if (res.data.orderStatusName == "Pending") this.getAllPaymentWay();
      }
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
  getAllPaymentWay() {
    this.apiService.get("PaymentWay/GetAll").subscribe((res: any) => {
      this.PaymentWayList = [];
      if (res.data)
        res.data.map((item: any) => {
          this.PaymentWayList.push({
            name: this.selectedLang == "en" ? item.enName : item.arName,
            code: item.paymentId,
            en: item.enName,
            ar: item.arName,
            descAr: item.arDescription,
            descEn: item.enDescription,
          });
        });
    });
  }
  onPaymentWaySelect(payment: number) {
    this.selectedPaymentValue = this.PaymentWayList.filter(
      (item) => item.code == payment
    );
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
