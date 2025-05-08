import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class ConfirmMsgService {

   formHasValue(form:FormGroup){
    const formValues = form.value;
    return Object.values(formValues).some(value => !!value);
   }
   
 }

