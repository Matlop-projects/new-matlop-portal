import { NgFor, NgIf } from "@angular/common";
import { Component, inject, effect } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ApiService } from "../../services/api.service";
import { RouterLink } from "@angular/router";
import { LanguageService } from "../../services/language.service";
import { LoginSignalUserDataService } from "../../services/login-signal-user-data.service";

interface Service {
  serviceId: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  priorityView: string;
  isActive: boolean;
  numOfTechnicals: number;
}

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [NgFor, TranslatePipe, RouterLink,NgIf],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  socailMedia:any[] = [];
  services: Service[] = [];
  selectedLang: string = 'ar';

  year = new Date().getFullYear();

  api = inject(ApiService);
  languageService = inject(LanguageService);
  private userDataService = inject(LoginSignalUserDataService);
  
  constructor() {
    // استخدام effect عشان نتابع تغييرات البلد
    effect(() => {
      const country = this.userDataService.selectedCountry();
      console.log('Country changed in Footer:', country);
      // جلب الروابط للبلد الجديد
      this.getAlllinks();
    });
  }
  
  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.getAllServices();
    
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
    });
  }
  getAlllinks() {
      const countryId = this.userDataService.getCountryId();
    this.api.get(`settings/getAll/${countryId}`).subscribe((res: any) => {
      if (res.data) {
        this.socailMedia = [
          {
            icon: "face.svg",
            routing: res.data.faceBookLink || "",
          },
          {
            icon: "twitter.svg",
            routing: res.data.xLink || "",
          },
          {
            icon: "instgram.svg",
            routing: res.data.instagramLink || "",
          },
          {
            icon: "tiktok.svg",
            routing: res.data.tikTokLink || "",
          },
          {
            icon: "snapchat.png",
            routing: res.data.snapChatLink || "",
          },
        ];
      }
    });
  }
  getAllServices() {
    this.api.get("Service/GetAll").subscribe((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        this.services = res.data.filter((service: Service) => service.isActive);
      }
    });
  }
  onClickSocial(routing: string) {
          console.log("🚀 ~ FooterComponent ~ onClickSocial ~ routing:", routing);
 if (!/^https?:\/\//i.test(routing)) {
      routing = 'https://' + routing;
    }

    window.open(routing, "_blank");
  }

  onClickDownload(app: string) {
    if (app === "apple") {
      window.open("https://apps.apple.com/eg/app/matlop-%D9%85%D8%B7%D9%84%D9%88%D8%A8/id6747580868", "_blank");
    } else if (app === "google") {
      window.open("https://play.google.com/store/apps/details?id=com.matlop.service&pcampaignid=web_share", "_blank");
    }
  }
}
