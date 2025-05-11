import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { authGuard } from './core/auth.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      // { path: 'login', component: LoginComponent },
      // { path: 'forget_password', component: ForgetPasswordComponent },
      // { path: 'reset_password', component: ResetPasswordComponent },
      // { path: 'signup', component: SignupComponent }
    ]
  },
  {
    path: '',
    component: HomeLayoutComponent,
    // canActivate: [authGuard], // Applying authGuard to the home layout
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'orders', component: OrdersListComponent },
      // { path: 'traders_list', component: TradersListComponent },
      // { path: 'trader_details/:id', component: TraderDetailsComponent },
      // { path: 'trader_all_details/:id/:type', component: TraderAllProductsComponent },
      // { path: 'product_details/:productId', component: ProductDetailsComponent },
      // { path: 'product_details/:productId/:traderId', component: ProductDetailsComponent },
      // { path: 'wishlist', component: FavItemsComponent ,canActivate: [authGuard] },
      // { path: 'cart', component: ShoppingCartComponent , canActivate: [authGuard] },
      // { path: 'become_trader', component: BecomeTraderComponent , },
    ]
  },
  // { path: '**', component: NotFoundComponent }
];
