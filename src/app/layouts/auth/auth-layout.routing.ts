import { Routes } from '@angular/router';
import {AuthLayoutComponent} from './auth-layout.component';
import {LoginComponent} from '../../login/login.component';


export const LoginRoutes: Routes = [
    {
    path: '',
    data:{requireAuth:false},
    children: [ {
      path: 'auth/login',
      component: LoginComponent
  }]
  }
];
