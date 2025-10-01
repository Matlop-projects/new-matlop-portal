import { NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ApiService } from "../../services/api.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [NgFor, TranslatePipe, RouterLink,NgIf],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  socailMedia:any[] = [];

  year = new Date().getFullYear();

  api = inject(ApiService);
  ngOnInit(): void {
    this.getAlllinks();
  }
  getAlllinks() {
    this.api.get("settings/getAll").subscribe((res: any) => {
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
            icon: "snapchat.svg",
            routing: res.data.snapchatLink || "",
          },
        ];
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
}
