import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-description-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './description-section.component.html',
  styleUrl: './description-section.component.scss'
})
export class DescriptionSectionComponent {

}
