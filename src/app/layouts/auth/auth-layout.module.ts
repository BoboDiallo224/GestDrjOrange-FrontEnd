import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from "ngx-pagination";
import {AuthService} from '../../auth/auth.service';
import {LoginRoutes} from './auth-layout.routing';
import {LoginComponent} from '../../login/login.component';
import {AuthLayoutComponent} from './auth-layout.component';



@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LoginRoutes),
        FormsModule,FormsModule,
        NgxPaginationModule
    ],
    declarations: [LoginComponent],
    providers: [AuthService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AuthLayoutModule {}
