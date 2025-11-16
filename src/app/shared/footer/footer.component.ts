import { NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
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
  
  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.getAlllinks();
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

  onClickDownload(platform: 'apple' | 'google') {
    // يمكنك تغيير الروابط حسب روابط تطبيقاتك الفعلية
    const links = {
      apple: 'https://apps.apple.com/app/your-app-ihttps://apps.apple.com/eg/app/matlop-%D9%85%D8%B7%D9%84%D9%88%D8%A8/id6747580868',
      google: 'https://play.google.com/store/apps/details?id=your.app.id'
    };
    
    window.open(links[platform], '_blank');
  }
}
