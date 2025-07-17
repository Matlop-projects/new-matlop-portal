import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { Router } from "@angular/router";
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../../components/background-image-with-text/background-image-with-text.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: "app-orders-list",
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe,PaginationComponent, BackgroundImageWithTextComponent , TranslatePipe],
  templateUrl: "./orders-list.component.html",
  styleUrl: "./orders-list.component.scss",
})
export class OrdersListComponent implements OnInit {

    languageService = inject(LanguageService)
  
    bkg_text_options: IBackGroundImageWithText = {
      imageUrl: 'assets/img/order-slider.svg',
      header: this.languageService.translate('ORDER_TRACKING.BANNER_HEADER'),
      description: this.languageService.translate('ORDER_TRACKING.BANNER_DESC'),
      style: {
        padding: "70px 0 0 0"
      }
    };
  private router = inject(Router);
  orders: any = [];
  activeStatus = "pending";
  ordersCount: any
  totalCount=0;

  searchObject:any = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    clientId: 0,
    paymentWayId: 0,
    orderStatus: null,
    packageId: 0,
    nextVistTime: null,
    coponeId: 0,
    orderSubTotal: 0,
    orderTotal: 0,
    locationId: 0,
  };
  private apiService = inject(ApiService);
  currentlang='en'
  ngOnInit(): void {
    const storedData = localStorage.getItem("userData");
      this.currentlang=this.languageService.translationService.currentLang

    if (storedData !== null) {
      const parsed = JSON.parse(storedData);
      const id: number = Number(parsed.id);
      this.searchObject.clientId = id;
      this.getOrdersCount(id)
    }
    this.getAllOrders();

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.currentlang=this.languageService.translationService.currentLang
      this.bkg_text_options.header = this.languageService.translate('ORDER_TRACKING.BANNER_HEADER');
    this.bkg_text_options.description = this.languageService.translate('ORDER_TRACKING.BANNER_DESC');
    });
  }
  onPageChange(page:any){
    this.searchObject.pageNumber=page
    console.log("🚀 ~ OrdersListComponent ~ onPageChange ~ page:", page)
        this.getAllOrders();

  }
  onSelectStatus(value: string) {
    this.activeStatus = value;
    if (value == "pending") {
      this.searchObject.orderStatus = null;
    } else if (value == "complete") {
      this.searchObject.orderStatus = 7;
    } else {
      this.searchObject.orderStatus = 8;
    }
    this.getAllOrders();
  }
  getAllOrders() {
    this.apiService
      .post("Order/GetByClientIdWithPagination", this.searchObject)
      .subscribe((res) => {
        if (res.data.dataList) {
          this.orders = res.data.dataList;
          this.totalCount=res.data.totalCount
        }
      });
  }
  getOrdersCount(clientId: number) {
    this.apiService.get(`order/GetOrderCountsByClientId`, { clientId: clientId }).subscribe((res: any) => {
      if (res.data) {
        this.ordersCount = res.data
      }
    })
  }
  onOrderDetails(orderId: number) {
    this.router.navigateByUrl(`order-details/${orderId}`);
  }

  formatDateTime(dateTime: any, type: string) {
    const cleanedIso = dateTime.split(".")[0]; // "2025-05-10T00:52:55"

    // Convert to Date object
    const date = new Date(cleanedIso);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }); // "10 May 2025"

    // Format time in 24-hour format
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); //

    if (type == 'date')
      return formattedDate
    else
      return formattedTime
  }
}
