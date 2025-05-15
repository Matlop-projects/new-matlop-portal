import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule,InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
private apiService = inject(ApiService);

  form = new FormGroup({
    name: new FormControl("",{
      validators:[
        Validators.required
      ]
    }),
    password:  new FormControl("",{
      validators:[
        Validators.required,
      ]
    })
  });

  login() {
   
    this.apiService.post("ContactUs/Create", this.form.value).subscribe((res) => {
      if (res) {
      }
    });
  }
}
