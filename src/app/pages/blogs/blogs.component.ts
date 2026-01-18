import { Component, inject, OnInit } from "@angular/core";
import { NgFor, NgIf, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ApiService } from "../../services/api.service";
import { LanguageService } from "../../services/language.service";
import { LoginSignalUserDataService } from "../../services/login-signal-user-data.service";
import { environment } from "../../../environments/environment";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import {
  BackgroundImageWithTextComponent,
  IBackGroundImageWithText,
} from "../../components/background-image-with-text/background-image-with-text.component";

interface Blog {
  blogId: number;
  enName: string;
  arName: string;
  enDescription: string;
  arDescription: string;
  coverAr: string;
  coverEn: string;
  orderNo: number;
  countryId: number;
  serviceId: number;
  creationTime?: string;
}

interface Service {
  serviceId: number;
  nameEn: string;
  nameAr: string;
}

@Component({
  selector: "app-blogs",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    TranslatePipe,
    DatePipe,
    PaginationComponent,
    BackgroundImageWithTextComponent,
  ],
  templateUrl: "./blogs.component.html",
  styleUrl: "./blogs.component.scss",
})
export class BlogsComponent implements OnInit {
  languageService = inject(LanguageService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private userDataService = inject(LoginSignalUserDataService);

  baseImgUrl = environment.baseImageUrl;
  blogs: Blog[] = [];
  services: Service[] = [];
  totalCount = 0;
  currentLang = "ar";
  selectedServiceId: number | null = null;

  searchObject = {
    pageNumber: 0,
    pageSize: 9,
    sortingExpression: "",
    sortingDirection: 0,
    serviceId: null as number | null,
  };

  bkg_text_options: IBackGroundImageWithText = {
    imageUrl: "assets/img/slider.svg",
    header: "",
    description: "",
    style: {
      padding: "70px 0 0 0",
    },
  };

  ngOnInit(): void {
    this.currentLang = this.languageService.translationService.currentLang;
    this.updateBannerText();
    this.getAllBlogs();
    this.getServices();

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.currentLang = this.languageService.translationService.currentLang;
      this.updateBannerText();
    });
  }

  updateBannerText(): void {
    this.bkg_text_options.header = this.languageService.translate(
      "BLOGS.BANNER_HEADER"
    );
    this.bkg_text_options.description = this.languageService.translate(
      "BLOGS.BANNER_DESC"
    );
  }

  getAllBlogs(): void {
    const countryId = this.userDataService.getCountryId();
    const params: any = {
      pageNumber: this.searchObject.pageNumber,
      pageSize: this.searchObject.pageSize,
      countryId: countryId,
    };

    if (this.searchObject.serviceId) {
      params.serviceId = this.searchObject.serviceId;
    }

    this.apiService
      .post("Blog/GetAllBlog", params)
      .subscribe((res: any) => {
        if (res.data?.dataList) {
          this.blogs = res.data.dataList;
          this.totalCount = res.data.totalCount;
        }
      });
  }

  getServices(): void {
    this.apiService.get("Service/GetAll").subscribe((res: any) => {
      if (res.data) {
        this.services = res.data;
      }
    });
  }

  onServiceFilterChange(): void {
    this.searchObject.pageNumber = 0;
    this.searchObject.serviceId = this.selectedServiceId;
    this.getAllBlogs();
  }

  onPageChange(page: number): void {
    this.searchObject.pageNumber = page;
    this.getAllBlogs();
  }

  getBlogName(blog: Blog): string {
    return this.currentLang === "en" ? blog.enName : blog.arName;
  }

  getBlogDescription(blog: Blog): string {
    const desc =
      this.currentLang === "en" ? blog.enDescription : blog.arDescription;
    // Strip HTML tags and truncate
    const strippedDesc = desc.replace(/<[^>]*>/g, "");
    return strippedDesc.length > 100
      ? strippedDesc.substring(0, 100) + "..."
      : strippedDesc;
  }

  defaultImage = "assets/img/placeholder-logo.svg";

  getBlogCover(blog: Blog): string {
    const cover = this.currentLang === "en" ? blog.coverEn : blog.coverAr;
    return cover ? this.baseImgUrl + cover : this.defaultImage;
  }

  onBlogDetails(blogId: number): void {
    this.router.navigateByUrl(`blog-details/${blogId}`);
  }

  getServiceName(service: Service): string {
    return this.currentLang === "en" ? service.nameEn : service.nameAr;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage;
  }

  // getLocale(): string {
  //   return this.currentLang === 'ar' ? 'ar' : 'en';
  // }
  
}
