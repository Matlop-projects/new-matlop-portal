import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-who-are-we-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './who-are-we-section.component.html',
  styleUrl: './who-are-we-section.component.scss'
})
export class WhoAreWeSectionComponent {
  private router =inject(Router)
  goToFAQS(){
    this.router.navigateByUrl('faqs-section')
  }
}
