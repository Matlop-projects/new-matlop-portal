import { Component, computed, Inject, inject, OnInit, HostListener } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "../../services/language.service";
import { ToasterService } from "../../services/toaster.service";
import { DOCUMENT, NgFor, NgIf } from "@angular/common";
import { InputGroup } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";
import { filter } from "rxjs/operators";
import { LoginSignalUserDataService } from "../../services/login-signal-user-data.service";
import { ApiService } from "../../services/api.service";
import { NotificationComponent } from "../../pages/notification/notification.component";
import { AddressesComponent } from "../addresses/addresses.component";

interface User {
  username: string;
  email: string;
  mobile: string;
  name: string | null;
}
@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    TranslateModule,
    NgIf,
    NotificationComponent,
    AddressesComponent,
    TranslatePipe,
    RouterModule,
    MenubarModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    InputGroup,
    InputTextModule,
    NgFor,
  ],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent implements OnInit {
  // hasPermission: boolean = false;
  profileImg = "assets/img/profile-circle.svg";
  localStorage = localStorage.getItem("token");
  isDropdownOpen = false;
  langOptions = [
    { name: "English", code: "en", icon: "assets/images/icons/en-lang.png" },
    { name: "العربية", code: "ar", icon: "assets/images/icons/ar-lang.png" },
  ];

  selectedLang: string = localStorage.getItem("lang") || "ar";
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  currentLang = "ar";
  items: MenuItem[] | undefined = [];
  activeRoute: string = "";
  authService = inject(LoginSignalUserDataService);
  api = inject(ApiService);
  // ✅ Move computed() outside ngOnInit()
  user = computed(() => this.authService.user());

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        this.profileImg =
          localStorage.getItem("img") ?? "assets/img/profile-circle.svg";
      });
  }

  ngOnInit(): void {
    console.log("User Signal:", this.user()); // ✅ Access computed() as a function
    this.initAppTranslation();
    // this.checkPermission();
    this.languageService.translationService.onLangChange.subscribe(
      (lang: any) => {
        this.updateMenuItems();
        this.selectedLang = lang.lang;
      }
    );
    this.updateMenuItems();
  }

  get languageToggleText(): string {
    return this.selectedLang.toUpperCase() === "AR"
      ? "NAVBAR.ENGLISH"
      : "NAVBAR.ARABIC";
  }

  // checkPermission() {
  //   this.api.post('Authentication/validateUserToken', { tokenToValidate: localStorage.getItem('token')??null }).subscribe((res: any) => {
  //     this.hasPermission = res?.data;
  //   })
  // }

  updateMenuItems() {
    this.items = [
      {
        label: this.languageService.translate("NAVBAR.HOME"),
        routerLink: "/",
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: this.languageService.translate("NAVBAR.CONTACT"),
        routerLink: "/aboutus",
      },
      // { label: this.languageService.translate('NAVBAR.DISCOUNTS'), routerLink: '/discounts' },
      {
        label: this.languageService.translate("NAVBAR.STORES"),
        routerLink: "/traders_list",
      },
      {
        label: this.languageService.translate("NAVBAR.BECOME_TRADER"),
        routerLink: "/become_trader",
      },
      // { label: this.languageService.translate('NAVBAR.ARTICLES'), routerLink: '/articles' },
      // {
      //   label: this.languageService.translate('NAVBAR.PRODUCTS'),
      //   items: [
      //     { label: this.languageService.translate('NAVBAR.FEATURES'), routerLink: '/products/features1' },
      //     { label: this.languageService.translate('NAVBAR.FEATURES'), routerLink: '/products/features2' },
      //     { label: this.languageService.translate('NAVBAR.FEATURES'), routerLink: '/products/features3' },
      //   ],
      // },
    ];
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === "en" ? "ar" : "en";
    this.currentLang = this.selectedLang;

    localStorage.setItem("lang", this.selectedLang);

    this.languageService.change(this.selectedLang);
    this.languageService.use(this.selectedLang);
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);

    this.document.body.dir = this.selectedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", this.selectedLang);
    document.documentElement.setAttribute(
      "dir",
      this.selectedLang === "ar" ? "rtl" : "ltr"
    );

    this.updateMenuItems();
  }

  logout() {
    localStorage.clear();
    this.authService.logout();
    // this.hasPermission=false;
    this.router.navigate(["/"]).then(() => {
      this.router.navigateByUrl("/home");
      window.location.reload();
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    
    // Ensure dropdown positioning is correct after opening
    if (this.isDropdownOpen) {
      setTimeout(() => {
        this.adjustDropdownPosition();
      }, 10);
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.closeDropdown();
  }

  navigateToAddresses() {
    this.router.navigate(['/addresses']);
    this.closeDropdown();
  }

  private adjustDropdownPosition() {
    const dropdown = document.querySelector('.profile-dropdown-menu') as HTMLElement;
    if (dropdown) {
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Check if dropdown goes beyond right edge
      if (rect.right > viewportWidth) {
        dropdown.style.right = '0px';
        dropdown.style.left = 'auto';
        dropdown.style.transform = `translateX(${rect.right - viewportWidth + 10}px)`;
      }
      
      // For RTL layout, check left edge
      if (document.documentElement.dir === 'rtl' && rect.left < 0) {
        dropdown.style.left = '0px';
        dropdown.style.right = 'auto';
        dropdown.style.transform = `translateX(${Math.abs(rect.left) + 10}px)`;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.profile-dropdown-container');
    if (!dropdown && this.isDropdownOpen) {
      this.closeDropdown();
    }
  }
}
