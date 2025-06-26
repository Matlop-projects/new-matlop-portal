import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor , TranslatePipe,RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  socailMedia =[
    {
      icon: 'face.svg',
      routing: ''
    },
    {
      icon: 'twitter.svg',
      routing: ''
    },
    {
      icon: 'instgram.svg',
      routing: ''
    },
    // {
    //   icon: 'pi pi-whatsapp',
    //   routing: ''
    // },
  ]

  year = new Date().getFullYear();

  api = inject(ApiService)
  ngOnInit(): void {
 
  }

}
