import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormControlName,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { ApiService } from "../../services/api.service";
import { Validations } from "../../validations";
@Component({
  selector: "app-about-us",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule],
  templateUrl: "./about-us.component.html",
  styleUrl: "./about-us.component.scss",
})
export class AboutUsComponent {
  private apiService = inject(ApiService);

  form = new FormGroup({
    name: new FormControl("",{
      validators:[
        Validators.required
      ]
    }),
    email:  new FormControl("",{
      validators:[
        Validators.required,
        Validations.emailValidator()
      ]
    }),
    mobile:  new FormControl("",{
      validators:[
        Validators.required,
        Validations.mobileStartWithNumber_5_Validator(),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]
    }),
    message:  new FormControl("",{
      validators:[
        Validators.required
      ]
    }),
  });

  onContactUs() {
   
    this.apiService.post("ContactUs/Create", this.form.value).subscribe((res) => {
      if (res) {
      }
    });
  }
}
