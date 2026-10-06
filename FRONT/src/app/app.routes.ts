import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Shop } from './components/shop/shop';
import { Admin } from './components/admin/admin';
import { authGuard } from './guards/auth-guard';
import { PageNotFound } from './components/page-not-found/page-not-found';


export const routes: Routes = [
    {path: 'home', title: 'Home', component:Home},
    {path: 'login', title: 'Login', component: Login},
    {path: 'register', title: 'Register', component: Register},
    {path: 'shop', title: 'Shop', component: Shop, canActivate:[authGuard]},
    {path: 'admin', title: 'Admin', component: Admin},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', title: '404|Page Not Found', component: PageNotFound}
];
