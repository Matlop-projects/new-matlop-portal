import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-slider-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './slider-section.component.html',
  styleUrl: './slider-section.component.scss'
})
export class SliderSectionComponent {

}
