import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-special-services-section',
  standalone: true,
  imports: [],
  templateUrl: './special-services-section.component.html',
  styleUrl: './special-services-section.component.scss'
})
export class SpecialServicesSectionComponent {

  router = inject(Router);

  goOrder(route: any) {
    if(route == 's') {
      this.router.navigate(['/special-order']);
    } else {
      this.router.navigate(['/emergency-order']);
    }
  }
}
