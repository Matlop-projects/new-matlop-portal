import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor , TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  socailMedia =[
    {
      icon: 'pi pi-facebook',
      routing: ''
    },
    {
      icon: 'pi pi-twitter',
      routing: ''
    },
    {
      icon: 'pi pi-instagram',
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.api.test().subscribe((res: any) => {
      console.log(res);
      
    })
    
  }

}
