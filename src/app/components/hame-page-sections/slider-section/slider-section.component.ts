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
}
