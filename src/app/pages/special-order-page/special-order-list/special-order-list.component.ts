import { NgFor, NgIf, TitleCasePipe } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { Router } from "@angular/router";
import {
  BackgroundImageWithTextComponent,
  IBackGroundImageWithText,
} from "../../../components/background-image-with-text/background-image-with-text.component";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "../../../services/language.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-special-order-list",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    TitleCasePipe,
    BackgroundImageWithTextComponent,
    TranslatePipe,
  ],
  templateUrl: "./special-order-list.component.html",
  styleUrl: "./special-order-list.component.scss",
})
export class SpecialOrderListComponent implements OnInit {
  languageService = inject(LanguageService);
  baseImgUrl=environment.baseImageUrl
  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: "assets/img/order-slider.svg",
    header: this.languageService.translate("ORDER_TRACKING.BANNER_HEADER"),
    description: this.languageService.translate("ORDER_TRACKING.BANNER_DESC"),
    style: {
      padding: "70px 0 0 0",
    },
  };
  private router = inject(Router);
  orders: any = [];
  activeStatus = "pending";
  ordersCount: any;

  searchObject = {
    pageNumber: 0,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    clientId: 0,
    specialOrderId: 0,
    amount: 0,
    media: "string",
    specialOrderEnum: 2,
    specialOrderStatusEnum: 1,
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
      this.bkg_text_options.header = this.languageService.translate(
        "ORDER_TRACKING.BANNER_HEADER"
      );
      this.bkg_text_options.description = this.languageService.translate(
        "ORDER_TRACKING.BANNER_DESC"
      );
    });
  }
  onSelectStatus(value: string) {
    this.activeStatus = value;
    if (value == "pending") {
      this.searchObject.specialOrderStatusEnum = 1;
    } else if (value == "complete") {
      this.searchObject.specialOrderStatusEnum = 2;
    } else {
      this.searchObject.specialOrderStatusEnum = 3;
    }
    this.getAllOrders();
  }
  getAllOrders() {
    this.apiService
      .post("SpecialOrder/GetAllWitPagination", this.searchObject)
      .subscribe((res) => {
        if (res.data.dataList) {
          this.orders = res.data.dataList;
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
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }); // "10 May 2025"
    console.log(
      "🚀 ~ SpecialOrderListComponent ~ formatDateTime ~ formattedDate:",
      formattedDate
    );

    // Format time in 24-hour format
    const formattedTime = date.toLocaleTimeString("en-GB", {
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
}
