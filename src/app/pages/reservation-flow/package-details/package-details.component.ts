import { Component, inject, ViewChild } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LanguageService } from "../../../services/language.service";
import { NgIf, NgFor, NgClass, CommonModule } from "@angular/common";
import { SelectModule } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { ToasterService } from "../../../services/toaster.service";
import { Dialog } from "primeng/dialog";
import { AddLocationComponent } from "../../../components/add-location/add-location.component";
import { DatePicker } from "primeng/datepicker";
import { TranslatePipe } from "@ngx-translate/core";
import { TooltipModule } from "primeng/tooltip";
import { InputNumberModule } from 'primeng/inputnumber';

import {
  BackgroundImageWithTextComponent,
  IBackGroundImageWithText,
} from "../../../components/background-image-with-text/background-image-with-text.component";
import { InputTextModule } from "primeng/inputtext";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PrimeNG } from "primeng/config";
import { LoginSignalUserDataService } from "../../../services/login-signal-user-data.service";
const primengTranslations = {
  ar: {
    dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    today: 'اليوم',
    clear: 'مسح',
    dateFormat: 'dd/mm/yy',
    firstDayOfWeek: 0,
    weekHeader: 'أسبوع',
  },
  en: {
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'dd/mm/yy',
    firstDayOfWeek: 0,
    weekHeader: 'Wk',
  }
};

@Component({
  selector: "app-package-details",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    NgClass,
    TranslatePipe,
    InputTextModule,
    TooltipModule,
    SelectModule,
    DatePicker,
    Dialog,
    FormsModule,
    AddLocationComponent,
    BackgroundImageWithTextComponent,
    InputNumberModule
  ],
  templateUrl: "./package-details.component.html",
  styleUrl: "./package-details.component.scss",
})
export class PackageDetailsComponent {
  @ViewChild('addLocationComponent') addLocationComponent?: AddLocationComponent;
  
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private userDataService = inject(LoginSignalUserDataService);
  primengConfig = inject(PrimeNG)
  selectedLang: any;
  walletBalance = 0;
  walletAmount: any = 0;
  languageService = inject(LanguageService);
  packageId: any;
  cities: any;
  toaster = inject(ToasterService);
  selectedEquipments: { equipmentId: number }[] = []; // declare at top of your TS file
  usedNumber: any;
  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: "assets/img/slider.svg",
    header: this.languageService.translate("ABOUT_US_CONTACT.BANNER_HEADER"),
    description: this.languageService.translate("ABOUT_US_CONTACT.BANNER_DESC"),
    style: {
      padding: "70px 0 0 0",
    },
  };

  ifPromoCode: boolean = false;

  paymentList: any[] = [];

  packageDetails: any;
  contractDetails: any;
  userId: any;
  locationList: any;
  locationSelect: any;
  coupon: any;
  invalidCoupn: boolean = false;
  validCoupon: boolean = false;
  invalidCoupnMessage: string = "";
  showAddLocationDialog: boolean = false;

  paymentSelect: any;
  isDragging = false;
  showWalletDialogOptions = false;
  openWithdrawalDialog: boolean = false;
  openDepositelDialog: boolean = false;
  depositePaymentDialog: boolean = false;
  workingHoursSelect: any;
  workingHoursList: any;
  safeIframeUrl: SafeResourceUrl | undefined;


  dates: any;
  minDate: Date | null = null; // Initialize as null
  maxDate: Date | null = null; // Initialize as null
  isDateInvalid: boolean = false;

  errorMessage: any;

  uploadedFiles: any[] = [];
  discountType: any;

  orderObject: any = {
    clientId: 0,
    paymentWayId: null,
    media: [],
    notes: "",
    packageId: 0,
    coponeId: null,
    locationId: null,
    vistTimeId: null,
    orderSubTotal: 0,
    orderTotal: 0,
    virtualPrice: 0,
    scheduleDates: [],
    orderEquipments: [],
  };

  contractName: any;
  isoDates: any;
  equipments: any[] = [];
  locations: any;
  promoCodeValue: any;
  priceAfterDiscountPrecentage: any;
  originalPckagePrice: any;

  ngOnInit(): void {
    this.packageId = this.route.snapshot.params["packageId"];
    this.orderObject.clientId = localStorage.getItem("userId");
    this.orderObject.packageId = this.packageId;
    this.getLocation();
    this.getPackageDetailsById(this.packageId);
    this.setCalendarLimits();
    this.getWorkingHours(this.packageId);
    this.getEquipmentsList(this.packageId);
    this.selectedLang = this.languageService.translationService.currentLang;
    this.displayDatepickerConfig(this.selectedLang)
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.displayDatepickerConfig(this.selectedLang)
      this.bkg_text_options.header = this.languageService.translate(
        "ABOUT_US_CONTACT.BANNER_HEADER"
      );
      this.bkg_text_options.description = this.languageService.translate(
        "ABOUT_US_CONTACT.BANNER_DESC"
      );
    });
    const today = new Date();
    this.minDate = new Date(today);
    this.minDate.setDate(today.getDate() + 1);
  }

  displayDatepickerConfig(lang: string) {
    this.primengConfig.setTranslation(primengTranslations[lang == 'en' ? 'en' : 'ar']);
  }

  getWalletBalance() {
    this.ApiService.get(
      `Wallet/GetBalanceClientId/${this.orderObject.clientId}`
    ).subscribe((res: any) => {
      console.log("🚀 ~ this.ApiService.get ~ res:", res);
      this.walletBalance = res.data.balance;
      this.getpaymentList();
    });
  }

  getPackageDetailsById(packageId: string) {
    this.ApiService.get(`Package/GetPackage/${packageId}`).subscribe(
      (item: any) => {
        console.log(item.data);
        this.packageDetails = item.data;
        this.packageDetails.couponPrice = 0;
        this.packageDetails.couponDiscount = 0;
        this.packageDetails.orderSubTotal = 0;
        this.originalPckagePrice = item.data.price
        this.packageDetails.orderTotal = item.data.price;
        this.orderObject.orderSubTotal = item.data.price;
        this.orderObject.orderTotal = item.data.price;
        this.packageDetails.virtualPrice = item.data.price
        console.log(this.orderObject);
        this.getWalletBalance();
      }
    );
  }

  getLocation() {
    const userId = localStorage.getItem("userId");
    this.ApiService.get(`Location/GetByUserId/${userId}`).subscribe(
      (res: any) => {
        if (res.data) {
          this.locations = res.data?.map((item: any) => ({
            name: `${item.countryName} - ${item.cityName}  ${item.districtName ? ' - ' + item.districtName : ''}  ${item.blockNo ? ' - ' + item.blockNo : ''}`,
            code: item.locationId,
          }));
        }
      }
    );
  }

  selectLocation(data: any) {
    this.orderObject.locationId = data.value;
  }

  addLocation() {
    this.showAddLocationDialog = true;
  }

  API_addLocation(payload: any) {
    this.ApiService.post("Location/Create", payload).subscribe((res) => {
      if (res) {
        this.toaster.successToaster(this.languageService.translate("PACKAGE_DETAILS.LOCATION_ADDED_SUCCESS"));
        this.getLocation();
      }
    });
  }

  onAddLocation(formValue: any) {
    this.API_addLocation(formValue);
    this.showAddLocationDialog = false;
  }

  onDialogShow() {
    // Refresh the map when dialog opens
    setTimeout(() => {
      this.addLocationComponent?.refreshMap();
    }, 100);
  }

  getpaymentList() {
    this.paymentList = [];
    this.paymentList.push(
      {
        paymentId: 1,
        enName: "cash",
        arName: "كاش",
        enDescription:
          "<p>Payment in cash to the worker supervisor upon completion of the order on site</p>",
        arDescription:
          "<p>الدفع كاش لمشرف العمال عند الانتهاء من الطلب في الموقع </p>",
        finalPayment: `cash - كاش `,
      },
      {
        paymentId: 2,
        enName: "credit card",
        arName: "بطاقة بنكية ",
        enDescription:
          "<p>Payment by bank card while ordering the package in the program</p>",
        arDescription:
          "<p>الدفع بواسطة البطاقة البنكية اثناء طلب الباقة في البرنامج </p>",
        finalPayment: `credit card - بطاقة بنكية `,
      },
      {
        paymentId: 3,
        enName: "wallet",
        arName: "محفظة ",
        enDescription:
          "<p>Payment using the wallet balance in the application</p>",
        arDescription: "<p>الدفع بواسطة رصيد المحفظة في التطبيق </p>",
        finalPayment: `wallet - محفظة `,
        disabled: this.walletBalance < this.packageDetails.price || this.walletBalance < this.packageDetails.virtualPrice, // Disable if wallet balance is 0 or less
      }
    );
  }
  // setCalendarLimits() {
  //   if (this.packageDetails) {
  //     if (this.packageDetails.packageType == 2) {
  //       this.minDate = new Date();
  //       this.minDate.setDate(this.minDate.getDate() + 1);

  //       this.maxDate = new Date();
  //       this.maxDate.setMonth(this.maxDate.getMonth() + 1);
  //     } else {
  //       this.minDate = new Date();
  //       this.minDate.setDate(this.minDate.getDate() + 1);

  //       this.maxDate = null;
  //     }
  //   }
  // }
  setCalendarLimits() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today;

    if (this.packageDetails?.packageType == 2) {
      const max = new Date();
      max.setMonth(max.getMonth() + 1);
      this.maxDate = max;
    } else {
      this.maxDate = null;
    }
  }

  validateMinDates() {
    let validationValue = 0;
    // packageType
    console.log(this.packageDetails);

    console.log(this.packageDetails);
    if (this.packageDetails.packageType == 2) {
      validationValue = Math.ceil(this.packageDetails.visitNumber / 4);
      console.log(validationValue);
      if (this.dates.length < validationValue) {
        this.errorMessage = `You must select at least ${validationValue} dates.`;
        this.isDateInvalid = true;
      } else {
        this.isDateInvalid = false;
        this.errorMessage = "";
        // this.isoDates = this.dates.map((date: any) =>
        //   date.toISOString()
        // );
        this.isoDates = this.dates.map((date: any) => {
          const now = new Date(); // Get current time
          date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

          return (
            `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}` +
            `T${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${date
                .getSeconds()
                .toString()
                .padStart(2, "0")}Z`
          );
        });
        this.orderObject.scheduleDates = this.isoDates;
      }
    } else {
      this.isDateInvalid = false;
      this.errorMessage = "";
      // this.isoDates = this.dates.map((date: any) => date.toISOString());
      this.isoDates = this.dates.map((date: any) => {
        const now = new Date(); // Get current time
        date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

        return (
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}` +
          `T${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
              .getSeconds()
              .toString()
              .padStart(2, "0")}Z`
        );
      });
      this.orderObject.scheduleDates = this.isoDates;
    }
  }

  getWorkingHours(PackageId: any) {
    this.ApiService.get(`Package/GetWorkTimeByPacakgeId/${PackageId}`).subscribe((hours: any) => {
      this.workingHoursList = hours.data?.map((item: any) => ({
        ...item,
        finalWorking: `${new Date(item.startDate).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(item.endDate).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      }));
    });
  }

  onPaymentChange(e: any) {
    this.orderObject.paymentWayId = e.value.paymentId;
  }

  onWorkingHoursChange(e: any) {
    this.orderObject.vistTimeId = e.value.workTimeId;
  }

  getEquipmentsList(packageId: any) {
    this.ApiService.get(`Equipment/GetByPackageId/${packageId}`).subscribe(
      (res: any) => {
        console.log(res);

        this.equipments = res.data?.map((item: any) => ({
          ...item,
          status: false, // ✅ Add status property
        }));

        console.log(this.equipments); // Now it will have status: false
      }
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.setFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFiles(input.files);
    }
  }

  setFiles(fileList: FileList) {
    const fileArray = Array.from(fileList);
    const mediaArray: { src: string; mediaTypeEnum: number }[] = [];

    const promises = fileArray.map((file) =>
      this.convertToBase64(file).then((base64) => {
        const mediaTypeEnum = this.getMediaTypeEnum(file.type);
        if (mediaTypeEnum !== null) {
          mediaArray.push({ src: base64, mediaTypeEnum });
        }
      })
    );

    Promise.all(promises).then(() => {
      this.orderObject.media = [...this.orderObject.media, ...mediaArray];
      console.log("media:", this.orderObject.media);
    });
  }

  removeMedia(index: number) {
    this.orderObject.media.splice(index, 1);
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  getMediaTypeEnum(mimeType: string): 1 | 2 | null {
    if (mimeType.startsWith("image/")) return 1;
    if (mimeType.startsWith("video/")) return 2;
    return null;
  }

  addWalletSubmit(type: string) {
    console.log(type);

    if (type == 'w') {
      let body = {
        userId: this.orderObject.clientId,
        walletTransactionId: 0,
        transactionType: 2,
        amount: this.walletAmount,
      };
      this.ApiService.post("Wallet/WalletTransaction", body).subscribe(
        (res: any) => {
          if (res) {
            this.toaster.successToaster(this.languageService.translate("PACKAGE_DETAILS.BALANCE_ADDED_SUCCESS"));
            this.showWalletDialogOptions = false;
            this.getPackageDetailsById(this.packageId);
          }
        }
      );
    } else {
      console.log(this.walletAmount);
      const url = `https://payment.matlop.com/Wallet/creditcard?userId=${this.orderObject.clientId}&amount=${+this.walletAmount}`;
      this.safeIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.openDepositelDialog = false;
      this.depositePaymentDialog = true;
    }
  }

  createOrder() {
    if (this.orderObject.locationId == null) {
      this.toaster.errorToaster(
        this.languageService.translate("PACKAGE_DETAILS.VALIDATION.LOCATION")
      );
    } else if (this.orderObject.paymentWayId == null) {
      this.toaster.errorToaster(
        this.languageService.translate("PACKAGE_DETAILS.VALIDATION.PAYMENT")
      );
    } else if (this.orderObject.vistTimeId == null) {
      this.toaster.errorToaster(
        this.languageService.translate("PACKAGE_DETAILS.VALIDATION.VISTI_TIME")
      );
    } else if (this.orderObject.scheduleDates.length == 0) {
      this.toaster.errorToaster(
        this.languageService.translate("PACKAGE_DETAILS.VALIDATION.SHCEDULE")
      );
    } else {
      console.log(this.orderObject);
      this.ApiService.post("Order/Create", this.orderObject).subscribe(
        (res: any) => {
          // console.log(res);
          // this.toaster.successToaster("تم اضافة الطلب بنجاح");
          const orderId = res.data.orderId;
          if (this.paymentSelect.paymentId == 2) {
            window.location.href = `https://payment.matlop.com/payment/creditcardweb?orderid=${orderId}`;
          } else {
            console.log(this.orderObject.orderTotal);
            // window.location.href = `${window.location.origin}/thank-you?status=paid&id=${orderId}&amount=${this.orderObject.orderTotal}&message=success`;
            window.location.href = `${window.location.origin}/#${this.router.serializeUrl(
              this.router.createUrlTree([
                '/thank-you'
              ], {
                queryParams: {
                  status: 'paid',
                  id: orderId,
                  amount: res.data.orderTotal,
                  message: 'success'
                }
              })
            )}`;
          }
        }
      );
    }
  }


  toggleStatus(equipment: any) {
    // Toggle the equipment status
    equipment.status = !equipment.status;

    // Add or subtract the price from orderTotal based on status
    if (equipment.status) {
      this.packageDetails.orderTotal += equipment.price;
    } else {
      this.packageDetails.orderTotal -= equipment.price;
    }

    // Update selectedEquipments list
    this.selectedEquipments = this.equipments
      .filter((item: any) => item.status)
      .map((item: any) => ({
        equipmentId: item.equipmentId,
        orderEquipmentId: 0,
        orderId: 0,
        price: item.price,
        nameAr: item.arName,
        nameEn: item.enName
      }));

    if (this.promoCodeValue && this.validCoupon) {
      this.orderObject.orderTotal = this.originalPckagePrice;
      this.orderObject.equipmentsPrice = this.selectedEquipments.reduce((total, item: any) => total + item.price, 0);
      this.orderObject.orderEquipments = this.selectedEquipments;
      this.packageDetails.equipmentsPrice = this.orderObject.equipmentsPrice;
      this.orderObject.orderTotal = this.originalPckagePrice + this.packageDetails.equipmentsPrice;
      this.onPromoCodeCheck('e'); //equipments
    } else {
      this.orderObject.equipmentsPrice = this.selectedEquipments.reduce((total, item: any) => total + item.price, 0);
      this.orderObject.orderEquipments = this.selectedEquipments;
      this.packageDetails.equipmentsPrice = this.orderObject.equipmentsPrice;
      this.orderObject.orderTotal = this.packageDetails.orderTotal;
    }
    this.getpaymentList();
  }



  onPromoCodeCheck(callingTYpe: string) {
    this.packageDetails.orderTotal = this.orderObject.orderTotal;
    this.ifPromoCode = false;
    console.log(this.promoCodeValue);
    if (this.promoCodeValue) {
      this.ApiService.get(`Copone/Verfiy/${this.promoCodeValue}/${+this.orderObject.clientId}`).subscribe((loc: any) => {
        this.invalidCoupn = false;
        this.validCoupon = true;
        this.orderObject.coponeId = loc.data.couponId;
        if (callingTYpe == 'p') {
          this.toaster.successToaster(this.languageService.translate("PACKAGE_DETAILS.COUPON_ADDED_SUCCESS"));
        }
        this.discountType = loc.data.coponeType;
        this.packageDetails.couponPrice = 0;
        this.packageDetails.couponDiscount = 0;
        this.packageDetails.couponType = loc.data.coponeType;
        this.packageDetails.hasMaxAmount = loc.data.hasMaxAmount;
        this.packageDetails.maxAmount = loc.data.maxAmount;
        if (loc.data.coponeType == 1) {
          this.packageDetails.couponDiscount = loc.data.amount;
          this.priceAfterDiscountPrecentage = this.packageDetails.orderTotal - this.calculateSalePrice(this.packageDetails.orderTotal, loc.data.amount);
          if (loc.data.hasMaxAmount && this.priceAfterDiscountPrecentage >= loc.data.maxAmount) {
            this.packageDetails.orderTotal = this.packageDetails.orderTotal - loc.data.maxAmount;
            this.packageDetails.couponPrice = this.packageDetails.orderTotal;
          } else {
            this.packageDetails.couponDiscount = loc.data.amount;
            this.packageDetails.orderTotal = this.packageDetails.orderTotal - this.priceAfterDiscountPrecentage;
            this.packageDetails.couponPrice = this.packageDetails.orderTotal;
          }
        } else {
          this.packageDetails.couponDiscount = loc.data.amount;
          this.packageDetails.orderTotal = this.packageDetails.orderTotal - loc.data.amount;
          this.packageDetails.couponPrice = this.packageDetails.orderTotal;
        }
        console.log(this.packageDetails);
        console.log(this.orderObject);
        this.ifPromoCode = true;
      }, err => {
        this.ifPromoCode = false;
        this.invalidCoupn = true;
        this.validCoupon = false;
        this.invalidCoupnMessage = err.error.message;
        // this.toaster.errorToaster(this.languageService.translate("PACKAGE_DETAILS.INVALID_COUPON"));
      }
      )
    } else {
      this.validCoupon = false;
      this.ifPromoCode = false;
      this.packageDetails.hasMaxAmount = false;
      this.packageDetails.couponPrice = 0;
      this.packageDetails.couponDiscount = 0;
      this.toaster.errorToaster(this.languageService.translate("PACKAGE_DETAILS.PLEASE_ADD_COUPON"));
    }
    this.getpaymentList();
  }

  calculateSalePrice(originalPrice: number, discountPercentage: number): number {
    return originalPrice - (originalPrice * discountPercentage) / 100;
  }

  walletActions(walletActionType: string) {
    this.showWalletDialogOptions = false;
    this.showWalletDialogOptions = false;
    if (walletActionType == 'w') {
      this.openWithdrawalDialog = true;
    } else {
      this.openDepositelDialog = true;
    }
  }

  onIframeLoad(iframe: HTMLIFrameElement) {
    try {
      const currentUrl = iframe.contentWindow?.location.href;

      if (currentUrl?.includes('Thankyou')) {
        const url = new URL(currentUrl);
        const id = url.searchParams.get('id');
        const status = url.searchParams.get('status');
        const amount = url.searchParams.get('amount');
        const message = url.searchParams.get('message');

        console.log('✅ Payment URL:', { id, status, amount, message });

        if (status === 'paid') {
          this.toaster.successToaster(this.languageService.translate("PACKAGE_DETAILS.PAYMENT_SUCCESS"));
          this.getWalletBalance();
          this.getPackageDetailsById(this.packageId);

        } else {
          this.toaster.errorToaster(this.languageService.translate("PACKAGE_DETAILS.PAYMENT_FAILED"));
        }

        this.depositePaymentDialog = false; // Close dialog if you want
      }
    } catch (err) {
      console.warn('🚫 Could not access iframe URL due to cross-origin:', err);
    }
  }

  calculate15Percent(value: number): number {
    return parseFloat((value * 0.15).toFixed(2));
  }

  /**
   * Get currency icon based on selected country
   * @returns string path to currency icon
   */
  getCurrencyIcon(): string {
    const selectedCountry = this.userDataService.getCountryId();
    return selectedCountry === 2 
      ? 'assets/images/icons-svg/Omani_Rial.svg' 
      : 'assets/images/icons-svg/Saudi_Riyal.svg';
  }
}