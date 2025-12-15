import { Component, inject, OnInit } from "@angular/core";
import { NgIf, NgFor, DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ApiService } from "../../../services/api.service";
import { LanguageService } from "../../../services/language.service";
import { LoginSignalUserDataService } from "../../../services/login-signal-user-data.service";
import { environment } from "../../../../environments/environment";
import {
  BackgroundImageWithTextComponent,
  IBackGroundImageWithText,
} from "../../../components/background-image-with-text/background-image-with-text.component";

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

@Component({
  selector: "app-blog-details",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TranslatePipe,
    DatePipe,
    BackgroundImageWithTextComponent,
  ],
  templateUrl: "./blog-details.component.html",
  styleUrl: "./blog-details.component.scss",
})
export class BlogDetailsComponent implements OnInit {
  languageService = inject(LanguageService);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userDataService = inject(LoginSignalUserDataService);

  baseImgUrl = environment.baseImageUrl;
  blog: Blog | null = null;
  relatedBlogs: Blog[] = [];
  isLoading = true;
  isLoadingRelated = false;
  isLoadingMore = false;
  currentLang = "ar";
  
  // Related blogs pagination
  relatedPageNumber = 0;
  relatedPageSize = 3;
  totalRelatedBlogs = 0;
  hasMoreRelatedBlogs = false;
  private currentBlogIdForRelated = 0;

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

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.currentLang = this.languageService.translationService.currentLang;
      this.updateBannerText();
    });

    const blogId = this.route.snapshot.paramMap.get("blogId");
    if (blogId) {
      this.getBlogDetails(+blogId);
    }
  }

  updateBannerText(): void {
    this.bkg_text_options.header = this.languageService.translate(
      "BLOGS.BANNER_HEADER"
    );
    this.bkg_text_options.description = this.languageService.translate(
      "BLOGS.BANNER_DESC"
    );
  }

  getBlogDetails(blogId: number): void {
    this.isLoading = true;
    this.apiService
      .get<any>(`Blog/GetBlog/${blogId}`)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.blog = res.data;
            // Fetch related blogs after getting blog details
            this.getRelatedBlogs(this.blog?.serviceId || 0, this.blog?.blogId || 0);
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getRelatedBlogs(serviceId: number, currentBlogId: number): void {
    this.isLoadingRelated = true;
    this.relatedPageNumber = 0;
    this.relatedBlogs = [];
    this.currentBlogIdForRelated = currentBlogId;
    
    const countryId = this.userDataService.getCountryId();
    const params = {
      pageNumber: this.relatedPageNumber,
      pageSize: this.relatedPageSize + 1, // +1 to account for current blog that will be filtered
      serviceId: serviceId,
      countryId: countryId,
    };

    this.apiService
      .post("Blog/GetAllBlog", params)
      .subscribe({
        next: (res: any) => {
          if (res.data?.dataList) {
            // Filter out the current blog from related blogs
            const filteredBlogs = res.data.dataList.filter(
              (blog: Blog) => blog.blogId !== currentBlogId
            );
            this.relatedBlogs = filteredBlogs.slice(0, this.relatedPageSize);
            this.totalRelatedBlogs = res.data.totalCount - 1; // -1 for current blog
            this.hasMoreRelatedBlogs = this.relatedBlogs.length < this.totalRelatedBlogs;
          }
          this.isLoadingRelated = false;
        },
        error: () => {
          this.isLoadingRelated = false;
        },
      });
  }

  loadMoreRelatedBlogs(): void {
    if (!this.blog || this.isLoadingMore) return;
    
    this.isLoadingMore = true;
    this.relatedPageNumber++;
    
    const countryId = this.userDataService.getCountryId();
    const params = {
      pageNumber: this.relatedPageNumber,
      pageSize: this.relatedPageSize + 1,
      serviceId: this.blog.serviceId,
      countryId: countryId,
    };

    this.apiService
      .post("Blog/GetAllBlog", params)
      .subscribe({
        next: (res: any) => {
          if (res.data?.dataList) {
            const filteredBlogs = res.data.dataList.filter(
              (blog: Blog) => blog.blogId !== this.currentBlogIdForRelated
            );
            this.relatedBlogs = [...this.relatedBlogs, ...filteredBlogs.slice(0, this.relatedPageSize)];
            this.hasMoreRelatedBlogs = this.relatedBlogs.length < this.totalRelatedBlogs;
          }
          this.isLoadingMore = false;
        },
        error: () => {
          this.isLoadingMore = false;
        },
      });
  }

  getBlogName(): string {
    if (!this.blog) return "";
    return this.currentLang === "en" ? this.blog.enName : this.blog.arName;
  }

  getBlogDescription(): string {
    if (!this.blog) return "";
    return this.currentLang === "en"
      ? this.blog.enDescription
      : this.blog.arDescription;
  }

  getBlogCover(): string {
    if (!this.blog) return "";
    const cover =
      this.currentLang === "en" ? this.blog.coverEn : this.blog.coverAr;
    return cover ? this.baseImgUrl + cover : "assets/img/blog-placeholder.svg";
  }

  goBack(): void {
    this.router.navigateByUrl("/blogs");
  }

  // Related blogs methods
  getRelatedBlogName(blog: Blog): string {
    return this.currentLang === "en" ? blog.enName : blog.arName;
  }

  getRelatedBlogDescription(blog: Blog): string {
    const desc =
      this.currentLang === "en" ? blog.enDescription : blog.arDescription;
    // Strip HTML tags and truncate
    const strippedDesc = desc.replace(/<[^>]*>/g, "");
    return strippedDesc.length > 100
      ? strippedDesc.substring(0, 100) + "..."
      : strippedDesc;
  }

  getRelatedBlogCover(blog: Blog): string {
    const cover = this.currentLang === "en" ? blog.coverEn : blog.coverAr;
    return cover ? this.baseImgUrl + cover : "assets/img/blog-placeholder.svg";
  }

  onRelatedBlogClick(blogId: number): void {
    this.router.navigateByUrl(`/blog-details/${blogId}`).then(() => {
      // Reload the blog details when navigating to a related blog
      this.getBlogDetails(blogId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
