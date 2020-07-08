import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductsComponent } from './pages/products/products.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'
import { FormsModule } from '@angular/forms';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer } from './store';
import { RegisterGuard } from './guards/register.guard';
import { ItemsComponent } from './components/items/items.component';
import { PaymentGuard } from './guards/payment.guard';
import { NgxPayPalModule } from 'ngx-paypal';
const rutes: Routes = [
  {path:'', component: ProductsComponent },
  {path:'payment', component: PaymentComponent,canActivate:[PaymentGuard] },
  {path:'login', component:LoginComponent,canActivate:[RegisterGuard]},
  {path:'register',component:RegisterComponent,canActivate:[RegisterGuard]}
]
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    PaymentComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ItemsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rutes),
    HttpClientModule,
    FormsModule,
    NgReduxModule,
    NgxPayPalModule
  ],
  exports: [RouterModule],
  providers: [],//Aquí deberían ir los guards
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux:NgRedux<IAppState>){
      ngRedux.configureStore(rootReducer,{cart:{}});
    }
 }
