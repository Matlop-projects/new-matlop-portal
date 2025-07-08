import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-how-we-work-section",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./how-we-work-section.component.html",
  styleUrl: "./how-we-work-section.component.scss",
})
export class HowWeWorkSectionComponent {
  private router = inject(Router);
  onClickOrder() {
    this.router.navigateByUrl("services-list");
  }
}
