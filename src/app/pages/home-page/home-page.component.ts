import { Component } from '@angular/core';
import { DescriptionSectionComponent } from '../../components/hame-page-sections/description-section/description-section.component';
import { HowWeWorkSectionComponent } from '../../components/hame-page-sections/how-we-work-section/how-we-work-section.component';
import { MainServicesSectionComponent } from '../../components/hame-page-sections/main-services-section/main-services-section.component';
import { OrderNowSectionComponent } from '../../components/hame-page-sections/order-now-section/order-now-section.component';
import { SliderSectionComponent } from '../../components/hame-page-sections/slider-section/slider-section.component';
import { SpecialServicesSectionComponent } from '../../components/hame-page-sections/special-services-section/special-services-section.component';
import { WhoAreWeSectionComponent } from '../../components/hame-page-sections/who-are-we-section/who-are-we-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DescriptionSectionComponent ,HowWeWorkSectionComponent ,MainServicesSectionComponent,OrderNowSectionComponent,SliderSectionComponent,SpecialServicesSectionComponent,WhoAreWeSectionComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
