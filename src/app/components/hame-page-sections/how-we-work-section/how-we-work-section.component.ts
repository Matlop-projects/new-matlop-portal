import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-how-we-work-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './how-we-work-section.component.html',
  styleUrl: './how-we-work-section.component.scss'
})
export class HowWeWorkSectionComponent {

}
