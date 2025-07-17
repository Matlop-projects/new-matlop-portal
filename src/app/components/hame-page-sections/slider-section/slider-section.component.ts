import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-slider-section",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./slider-section.component.html",
  styleUrl: "./slider-section.component.scss",
})
export class SliderSectionComponent {
  private router = inject(Router);
  onClickOrder() {
    this.router.navigateByUrl("services-list");
  }
  onClickDownload(app: string) {
    if (app === "apple") {
      window.open("https://play.google.com/store/apps/details?id=com.matlop.service&pcampaignid=web_share", "_blank");
    } else if (app === "google") {
      window.open("https://play.google.com/store/apps/details?id=com.matlop.service&pcampaignid=web_share", "_blank");
    }
  }
}
