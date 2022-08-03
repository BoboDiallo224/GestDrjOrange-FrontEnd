import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {SouscriptionComponent} from '../../souscription/souscription.component';
import {ParametrageComponent} from '../../parametrage/parametrage.component';
import {TypeContratServ} from '../../../Service/typeContratServ';
import {UsersServ} from '../../../Service/UsersServ';
import {NgxPaginationModule} from 'ngx-pagination';
import {DemandeServ} from '../../../Service/DemandeServ';
import {DemandeComponent} from '../../demande/demande.component';
import {DocumentServ} from '../../../Service/DocumentServ';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';
import {TraitementDemandeComplementComponent} from '../../traitementDemandeComplement/traitementDemandeComplement.component';
import {ContratServ} from '../../../Service/ContratServ';
import {DialogModule} from '@syncfusion/ej2-angular-popups';
import {ModalModule} from 'ngx-bootstrap';
import {Division} from '../../../Model/Division';
import {DivisionServ} from '../../../Service/DivisionServ';
import {ContratExistantComponent} from '../../contratExistant/contratExistant.component';
import {AccessGuard} from '../../auth/access-guard';
import {httpInterceptorProviders} from '../../auth/auth-interceptor';
import {GeneratePdfService} from '../../../Service/GeneratePdfService';
import {ExcelService} from '../../../Service/ExcelService';
import {ChargementComponent} from '../../chargement/chargement.component';
import {ValidateFormComponent} from '../../validateForm/validateForm.component';
import {NgxPrintModule} from 'ngx-print';



@NgModule({
  imports: [
    NgSelectModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ModalModule.forRoot(),
      NgxPaginationModule,
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({
      /*animationType: ngxLoadingAnimationTypes.rectangleBounce,*/
      /*backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'*/
    }),
    DialogModule,
    NgxPrintModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
   /* MapsComponent,*/
    NotificationsComponent,
    SouscriptionComponent,
    ParametrageComponent,
    DemandeComponent,
    ChargementComponent,
    TraitementDemandeComplementComponent,
    ContratExistantComponent,
    ValidateFormComponent
  ],
  providers: [
    TypeContratServ, UsersServ,DemandeServ,DocumentServ, ContratServ, DivisionServ,AccessGuard,
    httpInterceptorProviders,GeneratePdfService, ExcelService
  ]
})

export class AdminLayoutModule {}
