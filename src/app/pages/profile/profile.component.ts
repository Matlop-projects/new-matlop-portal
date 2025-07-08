import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Validations } from '../../validations';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { SelectModule } from 'primeng/select';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslatePipe,NgIf,FloatLabelModule,ReactiveFormsModule,DatePickerModule,InputTextModule,SelectModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  baseImageUrl=environment.baseImageUrl
  defaultImg:any="assets/img/profile-circle.svg"
user:any;
userId=localStorage.getItem('userId')
showBtn=false
genderList:any[]=[
  {name:"ذكر", code:1},
  {name:"أنثى", code:2}
]
private apiService = inject(ApiService);
private Router = inject(Router)
 form = new FormGroup({
    firstName: new FormControl("",{
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
     gender:  new FormControl("",{
      validators:[
        Validators.required,
        Validations.onlyNumberValidator()
      ]
    }),
   dateOfBirth: new FormControl<any>('', {
  validators: [Validators.required],
}),
      imgSrc:  new FormControl<any>("",),
  });

  ngOnInit(): void {
   this.getUserById();
  }
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;
    this.form.patchValue({ imgSrc: base64 });
    this.user.imgSrc = base64; // for api 
    this.defaultImg=base64 // for immediate preview
  };

  reader.readAsDataURL(file);
}

  onEditMode(){
    this.showBtn=true
  }
  getUserById(){
     this.apiService.get(`client/getById/${this.userId}`).subscribe((res:any)=>{
      this.user = res.data;
      this.form.patchValue({
        firstName: this.user?.firstName,
        email: this.user?.email,
        gender: this.user?.gender,
        dateOfBirth: new Date(this.user.dateOfBirth),
        imgSrc:this.baseImageUrl+this.user?.imgSrc
      })
            
this.defaultImg=this.form.value.imgSrc
    })

  }
  formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
onUpdate(){
console.log(this.user);
let payload={
  ...this.user,
  ...this.form.value,
  dateOfBirth: this.formatDateToYYYYMMDD(this.form.value.dateOfBirth),

}
this.apiService.put('client/update',payload).subscribe(res=>{
  if(res){
    this.getUserById()
    this.showBtn=false;
    localStorage.setItem('img',this.form.value.imgSrc);
    this.Router.navigateByUrl('home')
  }
})

}
onCancel(){
   this.Router.navigateByUrl('home')
}
}
