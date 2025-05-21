import { Component } from '@angular/core';
import { BackgroundImageWithTextComponent, IBackGroundImageWithText } from '../../components/background-image-with-text/background-image-with-text.component';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [BackgroundImageWithTextComponent],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent {
bkg_text_options:IBackGroundImageWithText={
  imageUrl:'assets/img/slider.svg',
header:'السياسة والخصوصية ',
description:'توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدامك لهذا الموقع الإلكتروني الذي تديره منصة مطلوب',
style:{
padding:"70px 0 0 0"
}
}
}