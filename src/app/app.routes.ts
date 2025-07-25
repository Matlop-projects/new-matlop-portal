import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { HomeLayoutComponent } from "./layouts/home-layout/home-layout.component";
import { authGuard } from "./core/auth.guard";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { OrdersListComponent } from "./pages/orders/orders-list/orders-list.component";
import { OrderDetailsComponent } from "./pages/orders/order-details/order-details.component";
import { ServicesListComponent } from "./pages/reservation-flow/services-list/services-list.component";
import { ContractListComponent } from "./pages/reservation-flow/contract-list/contract-list.component";
import { PackagesListComponent } from "./pages/reservation-flow/packages-list/packages-list.component";
import { AboutUsComponent } from "./pages/about-us/about-us.component";
import { SpecialOrderPageComponent } from "./pages/special-order-page/special-order-page.component";
import { EmergencyOrderPageComponent } from "./pages/emergency-order-page/emergency-order-page.component";
import { LoginComponent } from "./pages/login/login.component";
import { PackageDetailsComponent } from "./pages/reservation-flow/package-details/package-details.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { PrivacyPolicyComponent } from "./pages/privacy-policy/privacy-policy.component";
import { TermsConditionsComponent } from "./pages/terms-conditions/terms-conditions.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ThankYouComponent } from "./pages/thank-you/thank-you.component";
import { FaqsSectionComponent } from "./components/hame-page-sections/faqs-section/faqs-section.component";
import { ForgetPasswordComponentimplements } from "./pages/forget-password/forget-password.component";
import { SpecialOrderListComponent } from "./pages/special-order-page/special-order-list/special-order-list.component";
import { EmergencyOrderListComponent } from "./pages/emergency-order-page/emergency-order-list/emergency-order-list.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home", //auth if you want to start your app with auth
    pathMatch: "full",
  },
  {
    path: "auth",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
      { path: "forget_password", component: ForgetPasswordComponentimplements },
      // { path: 'reset_password', component: ResetPasswordComponent },
    ],
  },
  {
    path: "",
    component: HomeLayoutComponent,
    // canActivate: [authGuard], // Applying authGuard to the home layout
    children: [
      { path: "home", component: HomePageComponent },
      { path: "orders", component: OrdersListComponent },
      { path: "about-us", component: AboutUsComponent },
      {
        path: "order-details/:id",
        component: OrderDetailsComponent,
        canActivate: [authGuard],
      },
      { path: "services-list", component: ServicesListComponent },
      {
        path: "contract-list/:id",
        component: ContractListComponent,
        canActivate: [authGuard],
      },
      {
        path: "package-list/:contractId/:serviceId",
        component: PackagesListComponent,
        canActivate: [authGuard],
      },
      {
        path: "create-special-order",
        component: SpecialOrderPageComponent,
        canActivate: [authGuard],
      },
      {
        path: "special-order",
        component: SpecialOrderListComponent,
        canActivate: [authGuard],
      },
      {
        path: "create-emergency-order",
        component: EmergencyOrderPageComponent,
        canActivate: [authGuard],
      },
      {
        path: "emergency-order",
        component: EmergencyOrderListComponent,
        canActivate: [authGuard],
      },
      {
        path: "package-details/:packageId",
        component: PackageDetailsComponent,
        canActivate: [authGuard],
      },
      { path: "privacy-policy", component: PrivacyPolicyComponent },
      { path: "terms-conditions", component: TermsConditionsComponent },
      { path: "profile", component: ProfileComponent },
      { path: "thank-you", component: ThankYouComponent },
      { path: "faqs-section", component: FaqsSectionComponent },

      // { path: 'product_details/:productId/:traderId', component: ProductDetailsComponent },
      // { path: 'wishlist', component: FavItemsComponent ,canActivate: [authGuard] },
      // { path: 'cart', component: ShoppingCartComponent , canActivate: [authGuard] },
      // { path: 'become_trader', component: BecomeTraderComponent , },
    ],
  },
  // { path: '**', component: NotFoundComponent }
];
