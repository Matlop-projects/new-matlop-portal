import { Component, inject } from "@angular/core";
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
import {
  BackgroundImageWithTextComponent,
  IBackGroundImageWithText,
} from "../../../components/background-image-with-text/background-image-with-text.component";
import { InputTextModule } from "primeng/inputtext";
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
  ],
  templateUrl: "./package-details.component.html",
  styleUrl: "./package-details.component.scss",
})
export class PackageDetailsComponent {
  private ApiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  selectedLang: any;
  walletBalance = 0;
  walletAmount: any;
  languageService = inject(LanguageService);
  packageId: any;
  cities: any;
  toaster = inject(ToasterService);
  selectedEquipments: { equipmentId: number }[] = []; // declare at top of your TS file

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: "assets/img/slider.svg",
    header: this.languageService.translate("ABOUT_US_CONTACT.BANNER_HEADER"),
    description: this.languageService.translate("ABOUT_US_CONTACT.BANNER_DESC"),
    style: {
      padding: "70px 0 0 0",
    },
  };

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
  showWalletDialog = false;
  workingHoursSelect: any;
  workingHoursList: any;

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
    scheduleDates: [],
    orderEquipments: [],
  };

  contractName: any;
  isoDates: any;
  equipments: any[] = [];
  locations: any;
  promoCodeValue: any;

  ngOnInit(): void {
    this.packageId = this.route.snapshot.params["packageId"];
    this.getLocation();
    this.getPackageDetailsById(this.packageId);
    this.setCalendarLimits();
    this.getWorkingHours();
    this.getEquipmentsList(this.packageId);
    this.orderObject.clientId = localStorage.getItem("userId");
    this.orderObject.packageId = this.packageId;
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.bkg_text_options.header = this.languageService.translate(
        "ABOUT_US_CONTACT.BANNER_HEADER"
      );
      this.bkg_text_options.description = this.languageService.translate(
        "ABOUT_US_CONTACT.BANNER_DESC"
      );
    });
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
        this.orderObject.orderTotal = item.data.price;
        this.getWalletBalance();
      }
    );
  }

  getLocation() {
    const userId = localStorage.getItem("userId");
    this.ApiService.get("Location/GetByUserId/" + userId).subscribe(
      (res: any) => {
        if (res.data) {
          this.locations = res.data.map((item: any) => ({
            name: item.countryName,
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
        this.toaster.successToaster("تم اضافه موقع");
        this.getLocation();
      }
    });
  }

  onAddLocation(formValue: any) {
    this.API_addLocation(formValue);
    this.showAddLocationDialog = false;
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
        disabled: this.walletBalance < this.packageDetails.price, // Disable if wallet balance is 0 or less
      }
    );
    // console.log(
    //   this.walletBalance,
    //   "--------",
    //   this.packageDetails.price,
    //   "===",
    //   this.walletBalance < this.packageDetails.price
    // );
  }
  setCalendarLimits() {
    if (this.packageDetails) {
      if (this.packageDetails.packageType == 2) {
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);

        this.maxDate = new Date();
        this.maxDate.setMonth(this.maxDate.getMonth() + 1);
      } else {
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);

        this.maxDate = null;
      }
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
        this.isoDates = this.dates.map((date: any) => date.toISOString());
        this.orderObject.scheduleDates = this.isoDates;
      }
    } else {
      this.isDateInvalid = false;
      this.errorMessage = "";
      this.isoDates = this.dates.map((date: any) => date.toISOString());
      this.orderObject.scheduleDates = this.isoDates;
    }
  }

  getWorkingHours() {
    this.ApiService.get(`WorkingTime/GetAll`).subscribe((hours: any) => {
      this.workingHoursList = hours.data.map((item: any) => ({
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

        this.equipments = res.data.map((item: any) => ({
          ...item,
          status: false, // ✅ Add status property
        }));

        console.log(this.equipments); // Now it will have status: false
      }
    );
  }

  toggleStatus(equipment: any) {
    equipment.status = !equipment.status;

    // After toggling, regenerate the selectedEquipments array
    this.selectedEquipments = this.equipments
      .filter((item: any) => item.status)
      .map((item: any) => ({
        equipmentId: item.equipmentId,
        orderEquipmentId: 0,
        orderId: 0,
      }));

    console.log(this.selectedEquipments); // check in console
    this.orderObject.orderEquipments = this.selectedEquipments;
    console.log(this.orderObject);
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
  addWalletSubmit() {
    let body = {
      userId: this.orderObject.clientId,
      walletTransactionId: 0,
      transactionType: 1,
      amount: this.walletAmount,
    };
    this.ApiService.post("Wallet/WalletTransaction", body).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.successToaster("تم اضافة الرصيد بنجاح");
          this.showWalletDialog = false;
          this.getPackageDetailsById(this.packageId);
        }
      }
    );
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
          console.log(res);
          this.toaster.successToaster("تم اضافة الطلب بنجاح");
          const orderId = res.data.orderId;
          if(this.paymentSelect.paymentId == 2)
          window.location.href = `https://payment.matlop.com/payment/creditcardweb?orderid=${orderId}`;
        else
          window.location.href = `https://app-thank-you/thank-you?status=paid&id=${orderId}&amount=${this.orderObject.totalAmount}&message=success`;
      }
    );
  }
  }

  onPromoCodeCheck() {
    console.log(this.promoCodeValue);
      if (this.promoCodeValue) {
      this.ApiService.get(`Copone/Verfiy/${this.promoCodeValue}/${+this.orderObject.clientId}`).subscribe((loc: any) => {
        this.invalidCoupn = false;
        this.validCoupon = true;
        this.toaster.successToaster('Coupon Addedd Successfully');
        this.discountType = loc.data.coponeType;
        this.packageDetails.couponPrice = 0;
        this.packageDetails.couponDiscount = 0;
        if (loc.data.coponeType == 1) {
          this.packageDetails.couponDiscount = loc.data.amount;
          let priceAfterDiscountPrecentage = this.packageDetails.price - this.calculateSalePrice(this.packageDetails.price, loc.data.amount);
          if(loc.data.hasMaxAmount && priceAfterDiscountPrecentage >= loc.data.maxAmount) {
            this.packageDetails.couponPrice =  this.packageDetails.price - loc.data.maxAmount;
          } else {
            this.packageDetails.couponPrice = this.calculateSalePrice(this.packageDetails.price, loc.data.amount);
          }
          console.log(this.packageDetails);
        } else {
          this.packageDetails.couponDiscount = loc.data.amount;
          this.packageDetails.couponPrice = this.packageDetails.price - this.packageDetails.couponDiscount;
          console.log(this.packageDetails);
        }
      }, err => {
        this.invalidCoupn = true;
        this.validCoupon = false;
        this.invalidCoupnMessage = err.error.message;
        this.toaster.errorToaster('Invalid Coupon');
      })
    } else {
      this.toaster.errorToaster('Please Add Coupon');
    }
  }

   calculateSalePrice(originalPrice: number, discountPercentage: number): number {
    return originalPrice - (originalPrice * discountPercentage) / 100;
  }

}
