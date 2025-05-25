import { Component, inject, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { ApiService } from '../../services/api.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from '../../services/language.service';
export enum ModuleTypeEnum {
  Text = 0,
  Order = 1,
  SpecialOrder = 2
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [Popover,TranslatePipe, CommonModule, RouterModule, DialogModule, NgFor, NgIf],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})

export class NotificationComponent {

  private ApiService = inject(ApiService);

  notificationsList: any;
  showDialog = false;
  selectedNotification: any | null = null;
  totlaCount = 0;
  totalUnSeen = 0;
  @ViewChild('op') popover: Popover | undefined; // Reference to the popover
  private totalUnSeenCount$ = new BehaviorSubject<number | null>(null);
  private audio = new Audio('assets/sounds/notifications.mp3');
  private isUserInteracted = false;
  selectedLang: any;
  languageService = inject(LanguageService);
  constructor(private router: Router) { }

  ngOnInit(): void {
    window.addEventListener('click', () => this.isUserInteracted = true, { once: true });
    this.getNotifications();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getNotifications();
    })
      setInterval(() => {
      this.getNotifications();
    }, 180000);
  }

  getNotifications() {
    this.ApiService.get('Notification/GetNotifications').subscribe((noti: any) => {
      this.notificationsList = noti.data.data;
      this.totlaCount = noti.data.totalCount;
      this.totalUnSeen = noti.data.totalUnSeenCount;

      const newCount = noti.data.totalUnSeenCount;
      const oldCount = this.totalUnSeenCount$.value;

      if (oldCount !== null && newCount > oldCount && this.isUserInteracted) {
        this.playSound();
      }

      this.totalUnSeenCount$.next(newCount);
    });
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch(error => console.log('Audio play blocked:', error));
  }

  getModuleIcon(module: number): string {
    switch (module) {
      case ModuleTypeEnum.Order:
        return 'OR';
      case ModuleTypeEnum.SpecialOrder:
        return 'SO';
      case ModuleTypeEnum.Text:
        return 'T';
      default:
        return '?';
    }
  }

  handleNotificationClick(notification: any) {
    if (notification.module === ModuleTypeEnum.Text) {
      this.selectedNotification = notification;
      this.showDialog = true;
      this.seenNotification(notification.notificationId);
    } else {
      // Navigate to the appropriate route based on the module type
      const route = notification.module === ModuleTypeEnum.Order
        ? `/order/edit/${notification.entityId}`
        : `/special-order/edit/${notification.entityId}`;
      this.seenNotification(notification.notificationId);
      this.router.navigate([route]);
    }
    this.closePopover();
  }

  seenNotification(orderId: any) {
    this.ApiService.put(
      `Notification/seenNotification?id=${orderId}`,
      {}
    ).subscribe((res: any) => {
      console.log(res);
      this.getNotifications();
    });
  }

  closePopover() {
    if (this.popover) {
      this.popover.hide();
    }
  }

   getTimeAgo(dateStr: string, lang: 'en' | 'ar' = 'en'): string {
  const pastDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - pastDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (lang === 'ar') {
    if (seconds < 60) {
      return `منذ ${seconds} ثانية`;
    } else if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
      return `منذ ${hours} ساعة`;
    } else {
      return `منذ ${days} يوم`;
    }
  } else {
    if (seconds < 60) {
      return `since ${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (minutes < 60) {
      return `since ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `since ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `since ${days} day${days !== 1 ? 's' : ''}`;
    }
  }
}

}
