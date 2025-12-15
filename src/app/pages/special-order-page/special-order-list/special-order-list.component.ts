import { NgFor, NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "../../../services/language.service";
import { environment } from "../../../../environments/environment";
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { LoginSignalUserDataService } from "../../../services/login-signal-user-data.service";
import { Dialog } from "primeng/dialog";
import { ToasterService } from "../../../services/toaster.service";

@Component({
  selector: "app-special-order-list",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    TranslatePipe,
    PaginationComponent,
    Dialog
  ],
  templateUrl: "./special-order-list.component.html",
  styleUrl: "./special-order-list.component.scss",
})
export class SpecialOrderListComponent implements OnInit {
  languageService = inject(LanguageService);
  baseImgUrl=environment.baseImageUrl
  private router = inject(Router);
  userDataService = inject(LoginSignalUserDataService);
  toaster = inject(ToasterService);
  orders: any = [];
  activeStatus = "pending";
  ordersCount: any;
  totalCount=0;
  
  // Offers Dialog
  showOffersDialog: boolean = false;
  offers: any[] = [];
  selectedOrder: any = null;
  isAcceptingOffer: { [key: number]: boolean } = {};

  searchObject = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    clientId: null as number | null,
    specialOrderId: null,
    amount: null,
    media: "string",
    specialOrderEnum: 2,
    specialOrderStatusEnum: 0,
  };
  private apiService = inject(ApiService);
  currentlang = "en";
  ngOnInit(): void {
    const storedData = localStorage.getItem("userData");
    this.currentlang = this.languageService.translationService.currentLang;

    if (storedData !== null) {
      const parsed = JSON.parse(storedData);
      const id: number = Number(parsed.id);
      this.searchObject.clientId = id;
      this.getOrdersCount(id);
    }
    this.getAllOrders();

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.currentlang = this.languageService.translationService.currentLang;
    });
  }
  onSelectStatus(value: string) {
    this.searchObject.pageNumber=0,
    this.searchObject.pageSize= 8,
    this.activeStatus = value;
    if (value == "pending") {
      this.searchObject.specialOrderStatusEnum = 0;
    } else if (value == "complete") {
      this.searchObject.specialOrderStatusEnum = 7;
    } else {
      this.searchObject.specialOrderStatusEnum = 8;
    }
    this.getAllOrders();
  }
    onPageChange(page:any){
    this.searchObject.pageNumber=page
    console.log("🚀 ~ OrdersListComponent ~ onPageChange ~ page:", page)
        this.getAllOrders();

  }
  getAllOrders() {
    this.apiService
      .post("SpecialOrder/GetAllWitPagination", this.searchObject)
      .subscribe((res) => {
        if (res.data.dataList) {
          this.orders = res.data.dataList;
          this.totalCount=res.data.totalCount

        }
      });
  }
  getOrdersCount(clientId: number) {
    this.apiService
      .get(`SpecialOrder/GetSpecialOrderCountsByClientId`, { clientId: clientId ,specialOrderEnum:2})
      .subscribe((res: any) => {
        if (res.data) {
          this.ordersCount = res.data;

        }
      });
  }
  onOrderDetails(orderId: number) {
    this.router.navigateByUrl(`order-details/${orderId}`);
  }

  formatDateTime(dateTime: any, type: string) {
    const cleanedIso = dateTime.split(".")[0]; // "2025-05-10T00:52:55"

    // Convert to Date object
    const date = new Date(cleanedIso);
    
    // Use ar-EG with Gregorian calendar for Arabic, en-GB for English
    const locale = this.currentlang === 'ar' ? 'ar-EG' : 'en-GB';
    
    const formattedDate = date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      calendar: "gregory"
    }); // "10 May 2025"
    console.log(
      "🚀 ~ SpecialOrderListComponent ~ formatDateTime ~ formattedDate:",
      formattedDate
    );

    // Format time in 24-hour format
    const formattedTime = date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); //
    console.log(
      "🚀 ~ SpecialOrderListComponent ~ formatDateTime ~ formattedTime:",
      formattedTime
    );

    if (type == "date") return formattedDate;
    else return formattedTime;
  }

  onRequest() {
    this.router.navigateByUrl("create-special-order");
  }

  getOrderStatusText(orderStatusEnum: number): string {
    debugger;
    const isArabic = this.currentlang === 'ar';

    switch (orderStatusEnum) {
      case 0:
        return isArabic ? 'قيد الانتظار' : 'Pending';
      case 1:
        return isArabic ? 'مدفوع' : 'Paid';
      case 2:
        return isArabic ? 'مخصص للمزود' : 'AssignedToProvider';
      case 3:
        return isArabic ? 'فى الطريق' : 'InTheWay';
      case 4:
        return isArabic ? 'محاولة حل المشكلة' : 'TryingSolveProblem';
      case 5:
        return isArabic ? 'محلول' : 'Solved';
      case 7:
        return isArabic ? 'مكتمل' : 'Completed';
      case 6:
        return isArabic ? 'تم التأكيد من قبل العميل' : 'ClientConfirmation';
      case 8:
        return isArabic ? 'ملغي' : 'Cancelled';
      case 9:
        return isArabic ? 'لم يتم الحضور' : 'Not Attendance';
      default:
        return isArabic ? 'ملغي' : 'Cancelled';
    }
  }

  getCurrencyCode(): string {
    return this.userDataService.getCurrencyCode();
  }
  getStatusClass(statusEnum: number): string {
    switch (statusEnum) {
      case 1:
        return 'pending';
      case 2:
        return 'complete';
      case 3:
        return 'cancel';
      default:
        return 'pending';
    }
  }

  // Get offers for special order
  getOffers(specialOrderId: number) {
    this.selectedOrder = this.orders.find((o: any) => o.specialOrderId === specialOrderId);
    this.apiService
      .get(`SpecialOrderOffer/GetBySpecialOrderId/${specialOrderId}`)
      .subscribe({
        next: (res: any) => {
          if (res.data) {
            this.offers = res.data;
            this.showOffersDialog = true;
          } else {
            this.offers = [];
            this.showOffersDialog = true;
          }
        },
        error: (err) => {
          console.error('Error fetching offers:', err);
          this.toaster.errorToaster(
            this.currentlang === 'ar' ? 'خطأ في جلب العروض' : 'Error fetching offers'
          );
        }
      });
  }

  // Accept offer
  acceptOffer(offer: any) {
    // Prevent multiple clicks
    if (this.isAcceptingOffer[offer.specialOrderOfferId]) {
      return;
    }

    this.isAcceptingOffer[offer.specialOrderOfferId] = true;

    const payload = {
      technicalId: offer.technicalId,
      specialOrderOfferId: offer.specialOrderOfferId
    };

    this.apiService
      .post('SpecialOrderOffer/SubmitSpecialOrder', payload)
      .subscribe({
        next: (res: any) => {
          this.toaster.successToaster(
            this.currentlang === 'ar' ? 'تم قبول العرض بنجاح' : 'Offer accepted successfully'
          );
          this.showOffersDialog = false;
          this.getAllOrders(); // Refresh orders list
          this.isAcceptingOffer[offer.specialOrderOfferId] = false;
        },
        error: (err) => {
          console.error('Error accepting offer:', err);
          this.toaster.errorToaster(
            this.currentlang === 'ar' ? 'خطأ في قبول العرض' : 'Error accepting offer'
          );
          this.isAcceptingOffer[offer.specialOrderOfferId] = false;
        }
      });
  }

  closeOffersDialog() {
    this.showOffersDialog = false;
    this.offers = [];
    this.selectedOrder = null;
  }
}
