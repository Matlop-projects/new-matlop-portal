import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface IBackGroundImageWithText {
  imageUrl: string;
  header: string;
  description: string;
  style?: IStyle;
}
export interface IStyle {
 padding?: string;
 margin?: string;
 width?: string;
 height?: string;
}
@Component({
  selector: 'app-background-image-with-text',
  standalone: true,
  imports: [TranslatePipe,NgStyle],
  templateUrl: './background-image-with-text.component.html',
  styleUrl: './background-image-with-text.component.scss'
})
export class BackgroundImageWithTextComponent {
@Input() options: IBackGroundImageWithText = {
  imageUrl: '',
  header: '',
  description: '',
  style: {
    padding: '0',
    margin: '0',
    width: '100%',
    height: 'auto',
  }};
}
