import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalComponent } from '../modal/modal.component';
import { IDialog } from '../modal/modal.interface';

@Component({
  selector: 'app-otp-modal',
  standalone: true,
  imports: [ModalComponent,TranslatePipe, FormsModule, InputTextModule, PasswordModule, ButtonModule, InputOtp, NgIf],
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.scss']
})
export class OtpModalComponent {
  toaster = inject(ToasterService);
  otp: any;
  timer: number = 60;
  @Input() mobileNumber: string = '';
  @Output() otpValue = new EventEmitter();
  @Output() resendOtp = new EventEmitter()

  dialogProps: IDialog = {
    props: {
      visible: true
    },
    onHide: (e?: Event) => { },
    onShow: (e?: Event) => { }
  };

  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.mobileNumber = this.addStarsIntoMobileNumber(this.mobileNumber);
    this.startTimer();
  }

  addStarsIntoMobileNumber(mobileNumber: string): string {
    if (!mobileNumber || mobileNumber.length < 3) {
      return mobileNumber;
    }
    return `**${mobileNumber.slice(2)}`;
  }

  startTimer(): void {
    this.clearTimer();
    this.timer = 60;
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getFormattedTimer(): string {
    const minutes = Math.floor(this.timer / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.timer % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  resend(): void {
    this.startTimer();
    this.resendOtp.emit(true);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  checkOtpValue(e: any) {
    console.log(e.value);
    if(e.value.length ==4) {
      this.otpValue.emit({ otpValue: e.value })
    }
  }
}
