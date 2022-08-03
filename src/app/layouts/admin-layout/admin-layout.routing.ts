import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {SouscriptionComponent} from '../../souscription/souscription.component';
import {ParametrageComponent} from '../../parametrage/parametrage.component';
import {Demande} from '../../../Model/Demande';
import {DemandeComponent} from '../../demande/demande.component';
import {TraitementDemandeComplementComponent} from '../../traitementDemandeComplement/traitementDemandeComplement.component';
import {ContratExistantComponent} from '../../contratExistant/contratExistant.component';
import {AuthInterceptor} from '../../auth/auth-interceptor';
import {AccessGuard} from '../../auth/access-guard';
import {ChargementComponent} from '../../chargement/chargement.component';
import {ValidateFormComponent} from '../../validateForm/validateForm.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate:[AccessGuard] },
    { path: 'user-profile',   component: UserProfileComponent, canActivate:[AccessGuard] },
    { path: 'table-list',     component: TableListComponent, canActivate:[AccessGuard] },
    { path: 'typography',     component: TypographyComponent, canActivate:[AccessGuard]},
    { path: 'icons',          component: IconsComponent, canActivate:[AccessGuard]},
   /* { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent, canActivate:[AccessGuard]},
    { path: 'upgrade',        component: UpgradeComponent, canActivate:[AccessGuard]},*/
    { path: 'souscription',        component: SouscriptionComponent, canActivate:[AccessGuard]},
    { path: 'parametrage',        component: ParametrageComponent, canActivate:[AccessGuard]},
    { path: 'demande',        component: DemandeComponent, canActivate:[AccessGuard]},
    { path: 'contrat-existant',        component: ContratExistantComponent, canActivate:[AccessGuard]},
    { path: 'chargement-contrat',        component: ChargementComponent, canActivate:[AccessGuard]},
    { path: 'demandeComplement/:id',        component: TraitementDemandeComplementComponent, canActivate:[AccessGuard]},
    { path: 'fiche-validation/:id',        component: ValidateFormComponent, canActivate:[AccessGuard]},

];
