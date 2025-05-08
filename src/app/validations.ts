import { AbstractControl, ValidatorFn } from "@angular/forms";

 const arabicCharsRegex = /^[ء-ي0-9!@#\$%\^\& *\)\(+=._-]+]*$/;
 const englishCharsRegex = /^[A-Za-z0-9!@#<>\$%\^\& *\)\(+=._-]+]*$/;
const englishEditorRegex=  /^[a-zA-Z0-9\s<>&*#@!.,:;'"_-]*$|^[^\u0600-\u06FF]*$/;
const arabicEditorRegex=  /^[\u0600-\u06FF0-9\s<>&*#@!.,:;'"_-]*$/;;
 const charsRegex = /^[A-Za-zء-ي!@#\$%\^\& *\)\(+=._-]+]*$/;
 export const onlyArabicChar = /^[ء-ي]*$/;
 export const onlyEnglishChar = /^[A-Za-z]*$/;
 const urlRegex = /^((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)$/;
 const onlyNumbersRegex = /^[0-9]*$/
 const decimalNumber = /^[0-9]*\.?[0-9]*$/;
 const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const mobileNumberStartWith_5_Regex=/^5\d*$/


  export class Validations{
    static isEqualNumber(number:any,errorMessage: string): ValidatorFn {
      const errorMsg =errorMessage+' ( '+number+' )'
      return (control: AbstractControl<string>) => {
        var isValid = number >= control.value;
        return isValid ? null : { isMax: errorMsg };
      };
    }
   
 static emailValidator(errorMessage?: string): ValidatorFn {
  return (control: AbstractControl<string>) => {
    var isValid = emailRegex.test(control.value);
    return isValid ? null : { email: errorMessage };
  };
}

static editorEnglishCharsValidator(errorMessage?: string): ValidatorFn {
  return (control: AbstractControl<string>) => {
    var isValid = isEnglishEditorValidator(control.value);
    return isValid ? null : { english_char_only: errorMessage };
  };
}

static editorArabicCharsValidator(errorMessage?: string): ValidatorFn {
  return (control: AbstractControl<string>) => {
    var isValid = isArabicEditorValidator(control.value);
    return isValid ? null : { arabic_char_only: errorMessage };
  };
}
    static arabicCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isArabic(control.value);
          return isValid ? null : { arabic_char_only: errorMessage };
        };
      }

      static englishCharsValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isEnglish(control.value);
          return isValid ? null : { english_char_only: errorMessage };
        };
      }
      static onlyArabicValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isOnlyArabic(control.value);
          return isValid ? null : { arabic_only: errorMessage };
        };
      }

      static onlyEnglishValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isOnlyEnglish(control.value);
          return isValid ? null : { english_only: errorMessage };
        };
      }

      static decimalNumberValidators(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isDecimal(control.value);
          return isValid ? null : { decimal_number: errorMessage };
        };
      }
      static onlyNumberValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isNumber(control.value);
          return isValid ? null : { only_number: errorMessage };
        };
      }

      static mobileStartWithNumber_5_Validator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isMobilenumberWith_5(control.value);
          return isValid ? null : { mobileNumber_5: errorMessage };
        };
      }

      static onlyCharacterValidator(errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = isChar(control.value);
          return isValid ? null : { only_char: errorMessage };
        };
      }

      static confirmValue(input:any,errorMessage?: string): ValidatorFn {
        return (control: AbstractControl<string>) => {
          var isValid = control.value === input;
          console.log("Validations  return  control:", control)
          return isValid ? null : { confirm_password: errorMessage };
        };
      }
  }



  
  export function removePtags(input: string): string {
    return input.replace(/<\/?p>/g, ''); 
  }


  export function isArabic(value: string): boolean {
    if (value) {
      return arabicCharsRegex.test(value);
    } else {
      return true;
    }
  }

  export function isEnglish(value: string): boolean {
    if (value) {
      return englishCharsRegex.test(value);
    } else {
      return true;
    }
  }
  export function isEnglishEditorValidator(value: string): boolean {
    if (value) {
      return englishEditorRegex.test(value);
    } else {
      return true;
    }
  }
  export function isArabicEditorValidator(value: string): boolean {
    if (value) {
      return arabicEditorRegex.test(removePtags(value));
    } else {
      return true;
    }
  }

  export function isOnlyEnglish(value: string): boolean {
    if (value) {
      return onlyEnglishChar.test(value);
    } else {
      return true;
    }
  }

  export function isOnlyArabic(value: string): boolean {
    if (value) {
      return onlyArabicChar.test(value);
    } else {
      return true;
    }
  }

  export function isNumber(value: string): boolean {
    if (value) {
      return onlyNumbersRegex.test(value);
    } else {
      return true;
    }
  }

  export function isMobilenumberWith_5(value: string): boolean {
    if (value) {
      return mobileNumberStartWith_5_Regex.test(value);
    } else {
      return true;
    }
  }
  

  export function isDecimal(value: string): boolean {
    if (value) {
      return decimalNumber.test(value);
    } else {
      return true;
    }
  }
  export function isChar(value: string): boolean {
    if (value) {
      return charsRegex.test(value);
    } else {
      return true;
    }
  }
