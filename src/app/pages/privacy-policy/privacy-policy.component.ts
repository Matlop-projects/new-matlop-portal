import { Component } from '@angular/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from "../../components/background-image-with-text/background-image-with-text.component";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [BackgroundImageWithTextComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
bkg_text_options:IBackGroundImageWithText={
  imageUrl:'assets/img/slider.svg',
header:'الشروط والأحكام ',
description:'هذه الشروط والأحكام توضح وتحكم العلاقة بينك وبين هذا الموقع الإلكتروني الذي تديره منصة مطلوب',
style:{
padding:"70px 0 0 0"
}
}
}
