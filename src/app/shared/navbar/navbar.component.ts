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
  profileImg = "assets/img/saudi-avatar.svg";
  localStorage = localStorage.getItem("token");
  isDropdownOpen = false;
  langOptions = [
    { name: "English", code: "en", icon: "assets/images/icons/en-lang.png" },
    { name: "العربية", code: "ar", icon: "assets/images/icons/ar-lang.png" },
  ];

  getLogoImage(): string {
    if (this.selectedLang === "ar") {
      return "assets/img/matlop_logo.svg";
    }else { 
      return "assets/img/Gemini_Image.png";
    }
  }

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
        this.profileImg = this.getProfileImage();
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

  getProfileImage(): string {
    ;
    const userImg = localStorage.getItem("img");
    if (userImg && userImg.trim() !== '' && userImg !== 'null' && userImg !== 'undefined' && userImg !== "https://backend.matlop.comnull") {
      return userImg;
    }
    return "assets/img/arabian-man.png";
  }

  get languageToggleText(): string {
    return this.selectedLang.toUpperCase() === "AR"
      ? "NAVBAR.ENGLISH"
      : "NAVBAR.ARABIC";
  }
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
    const container = document.querySelector('.profile-dropdown-container') as HTMLElement;
    const layoutContainer = document.querySelector('.layout-container') as HTMLElement;
    
    if (dropdown && container) {
      // Reset classes first
      dropdown.classList.remove('position-left', 'position-right', 'mobile-adjust-left', 'mobile-adjust-right');
      
      // Get viewport and element dimensions
      const viewportWidth = window.innerWidth;
      const containerRect = container.getBoundingClientRect();
      const dropdownWidth = dropdown.offsetWidth;
      
      // Get layout container bounds if available
      const layoutRect = layoutContainer ? layoutContainer.getBoundingClientRect() : null;
      const layoutRightBound = layoutRect ? layoutRect.right : viewportWidth;
      const layoutLeftBound = layoutRect ? layoutRect.left : 0;
      
      // Check if we're on mobile
      const isMobile = window.innerWidth <= 768;
      
      // Calculate available space within layout container
      const spaceOnRight = layoutRightBound - containerRect.right;
      const spaceOnLeft = containerRect.left - layoutLeftBound;
      
      // Determine positioning based on available space within layout container
      if (document.documentElement.dir === 'rtl') {
        // For RTL (Arabic), prefer left positioning but adjust if needed
        if (spaceOnLeft >= dropdownWidth) {
          dropdown.classList.add('position-left');
        } else if (spaceOnRight >= dropdownWidth) {
          dropdown.classList.add('position-right');
        } else {
          // Not enough space on either side, position to fit best within layout
          dropdown.classList.add(spaceOnLeft > spaceOnRight ? 'position-left' : 'position-right');
          if (isMobile) {
            dropdown.classList.add(spaceOnLeft > spaceOnRight ? 'mobile-adjust-left' : 'mobile-adjust-right');
          }
        }
      } else {
        // For LTR (English), prefer right positioning but adjust if needed
        if (spaceOnRight >= dropdownWidth) {
          dropdown.classList.add('position-right');
        } else if (spaceOnLeft >= dropdownWidth) {
          dropdown.classList.add('position-left');
        } else {
          // Not enough space on either side, position to fit best within layout
          dropdown.classList.add(spaceOnRight > spaceOnLeft ? 'position-right' : 'position-left');
          if (isMobile) {
            dropdown.classList.add(spaceOnRight > spaceOnLeft ? 'mobile-adjust-right' : 'mobile-adjust-left');
          }
        }
      }
      
      // Additional check to ensure dropdown doesn't exceed layout bounds
      setTimeout(() => {
        const updatedRect = dropdown.getBoundingClientRect();
        if (layoutRect) {
          if (updatedRect.right > layoutRect.right) {
            dropdown.style.transform = `translateX(-${updatedRect.right - layoutRect.right + 10}px)`;
          } else if (updatedRect.left < layoutRect.left) {
            dropdown.style.transform = `translateX(${layoutRect.left - updatedRect.left + 10}px)`;
          }
        }
      }, 50);
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
