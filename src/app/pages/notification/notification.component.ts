import { Component, inject, ViewChild } from "@angular/core";
import { Popover } from "primeng/popover";
import { ApiService } from "../../services/api.service";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { TranslatePipe } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { LanguageService } from "../../services/language.service";

export enum ModuleTypeEnum {
  Text = 0,
  Order = 1,
  SpecialOrder = 2,
}

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [
    Popover,
    TranslatePipe,
    CommonModule,
    RouterModule,
    DialogModule,
    NgFor,
    NgIf,
  ],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
})
export class NotificationComponent {
  @ViewChild("op") popoverRef: any;
  @ViewChild("op") popover: Popover | undefined;

  private ApiService = inject(ApiService);
  is_fixed = false;
  notificationsList: any;
  showDialog = false;
  selectedNotification: any | null = null;
  totlaCount = 0;
  totalUnSeen = 0;
  private totalUnSeenCount$ = new BehaviorSubject<number | null>(null);
  private audio = new Audio("assets/sounds/notifications.mp3");
  private isUserInteracted = false;
  selectedLang: any;
  languageService = inject(LanguageService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    window.addEventListener("click", () => (this.isUserInteracted = true), {
      once: true,
    });

    // Set initial language
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';

    this.getNotifications();

    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getNotifications();
    });

    setInterval(() => {
      this.getNotifications();
    }, 180000); // 3 minutes
  }

  getNotifications() {
    console.log("getNotifications - START");
    const expirationTime = this.getTokenExpirationFromJWT();

    console.log("Token expiration time:", expirationTime);
    console.log("Current time:", Date.now());
    console.log("Is expired?", expirationTime ? this.isTokenExpired(expirationTime) : "No expiration time");

    if (!expirationTime || this.isTokenExpired(expirationTime)) {
      console.log("⛔ Token is missing or expired - API call SKIPPED");
      return;
    }

    console.log("✅ Token is valid - Making API call");
    this.ApiService.get("Notification/GetNotifications").subscribe({
      next: (noti: any) => {
        console.log("✅ API Response received:", noti);
        this.notificationsList = noti.data.data;
        this.totlaCount = noti.data.totalCount;
        this.totalUnSeen = noti.data.totalUnSeenCount;

        const newCount = noti.data.totalUnSeenCount;
        const oldCount = this.totalUnSeenCount$.value;

        if (oldCount !== null && newCount > oldCount && this.isUserInteracted) {
          this.playSound();
        }

        this.totalUnSeenCount$.next(newCount);
      },
      error: (error) => {
        console.error("❌ API Error:", error);
      }
    });
  }

  getTokenExpirationFromJWT(): number | null {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.warn("⚠️ No token found in localStorage");
      return null;
    }

    // Check if token has 3 parts (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Invalid JWT format - token should have 3 parts, found:", parts.length);
      console.error("Token value:", token.substring(0, 50) + "...");
      return null;
    }

    try {
      // Decode base64url with UTF-8 support (handles Arabic and other Unicode characters)
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      if (!payload.exp) {
        console.warn("⚠️ Token has no expiration (exp) claim");
        return null;
      }
      
      console.log("✅ Token decoded successfully. Expires at:", new Date(payload.exp * 1000));
      return payload.exp * 1000;
    } catch (error) {
      console.error("❌ Failed to decode token:", error);
      console.error("Token payload part:", parts[1].substring(0, 50) + "...");
      return null;
    }
  }

  isTokenExpired(expirationTimestamp: number): boolean {
    return Date.now() > expirationTimestamp;
  }

  onClickNotification(): void {
    if (this.popoverRef?.overlayVisible) {
      this.is_fixed = true;
      setTimeout(() => {
        const popoverEl = document.querySelector(".p-popover.p-component") as HTMLElement;
        if (popoverEl) {
          popoverEl.style.position = "fixed";
        }
      }, 50);
    } else {
      this.is_fixed = false;
    }
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch((error) => console.log("Audio play blocked:", error));
  }

  getModuleIcon(module: number): string {
    switch (module) {
      case ModuleTypeEnum.Order:
        return "OR";
      case ModuleTypeEnum.SpecialOrder:
        return "SO";
      case ModuleTypeEnum.Text:
        return "T";
      default:
        return "?";
    }
  }

  handleNotificationClick(notification: any) {
    if (notification.module === ModuleTypeEnum.Text) {
      this.selectedNotification = notification;
      this.showDialog = true;
      this.seenNotification(notification.notificationId);
    } else {
      const route =
        notification.module === ModuleTypeEnum.Order
          ? `/order/edit/${notification.entityId}`
          : `/special-order/edit/${notification.entityId}`;
      this.seenNotification(notification.notificationId);
      this.router.navigate([route]);
    }

    this.closePopover();
  }

  seenNotification(orderId: any) {
    this.ApiService.put(`Notification/seenNotification?id=${orderId}`, {}).subscribe(() => {
      this.getNotifications();
    });
  }

  closePopover() {
    if (this.popover) {
      this.popover.hide();
      this.is_fixed = false;
    }
  }

  getTimeAgo(dateStr: string, lang: "en" | "ar" = "en"): string {
    const pastDate = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - pastDate.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (lang === "ar") {
      if (seconds < 60) return `منذ ${seconds} ثانية`;
      else if (minutes < 60) return `منذ ${minutes} دقيقة`;
      else if (hours < 24) return `منذ ${hours} ساعة`;
      else return `منذ ${days} يوم`;
    } else {
      if (seconds < 60) return `since ${seconds} second${seconds !== 1 ? "s" : ""}`;
      else if (minutes < 60) return `since ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      else if (hours < 24) return `since ${hours} hour${hours !== 1 ? "s" : ""}`;
      else return `since ${days} day${days !== 1 ? "s" : ""}`;
    }
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const locale = this.selectedLang === 'ar' ? 'ar-SA' : 'en-GB';
    
    return date.toLocaleString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}
