import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DialogModule} from '@syncfusion/ej2-angular-popups';
import { ModalModule } from 'ngx-bootstrap/modal';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {DivisionServ} from '../Service/DivisionServ';
import {AccessGuard} from './auth/access-guard';
import {httpInterceptorProviders} from './auth/auth-interceptor';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ModalModule.forRoot(),
      DialogModule,
    ToastrModule.forRoot(),
    //ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent

  ],
  providers: [AccessGuard, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
