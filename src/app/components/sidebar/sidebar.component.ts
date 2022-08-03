import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'media-2_sound-wave', class: '' },
  { path: '/souscription', title: 'Souscription',  icon:'ui-1_send', class: '' },
  { path: '/demande', title: 'Demande',  icon: 'education_atom', class: '' },
  { path: '/contrat-existant', title: 'Contrats Existants',  icon:'files_paper', class: '' },
  { path: '/parametrage', title: 'Parametrage',  icon:'ui-1_settings-gear-63', class: '' },
  { path: '/chargement-contrat', title: 'Chargement',  icon:'ui-1_settings-gear-63', class: '' }


  /*................................................Demandeur................................................*/

 // { path: '/demandeEnCours', title: 'Demande En Cours',  icon:'ui-1_settings-gear-63', class: '' }


  /*{ path: '/user-profile', title: 'Users Profile',  icon:'users_single-02', class: '' },
  { path: '/table-list', title: 'Table List',  icon:'design_bullet-list-67', class: '' },
  { path: '/maps', title: 'Maps',  icon: 'location_map-big', class: '' },
  { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
  { path: '/notifications', title: 'Notifications',  icon: 'ui-1_bell-53', class: '' },
  { path: '/user-profile', title: 'Users Profile',  icon:'users_single-02', class: '' },
  { path: '/icons', title: 'Icons',  icon: 'education_atom', class: '' },
  { path: '/typography', title: 'Typography',  icon:'text_caps-small', class: '' },
  { path: '/upgrade', title: 'Upgrade to PRO',  icon:'objects_spaceship', class: 'active active-pro' }*/

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  public menuUserItems:any[]=[];
  role:string ; /*ROLE_ADMIN  ROLE_DEMANDEUR*/
  constructor( private auth:AuthService) { }

  ngOnInit() {

    this.auth.user().authorities.forEach(
      ele=>{
        this.role = ele.authority;

        //console.log(this.role)
      }
    );

    this.menuItems = ROUTES.filter(menuItem => menuItem);

    if(this.role === 'ROLE_DEMANDEUR') {

      ROUTES.forEach(item=>{

        if (item.title!='Parametrage' && item.title!='Dashboard' && item.title!='Chargement') {

          this.menuUserItems.push(item);
        }
      });

      this.menuItems = this.menuUserItems;

    }

    else if(this.role === 'ROLE_GESTIONNAIRE') {

      ROUTES.forEach(item=>{

        if (item.title!='Parametrage') {

          this.menuUserItems.push(item);
        }
      });

      this.menuItems = this.menuUserItems;

    }

    else if (this.role === 'ROLE_VALIDATEUR') {

      ROUTES.forEach(item=>{

        if (item.title!='Contrats Existants' && item.title!='Parametrage' && item.title!='Dashboard' && item.title!='Chargement') {

          this.menuUserItems.push(item);
        }
      });

      this.menuItems = this.menuUserItems;
    }



   /* else if(this.role == 'ROLE_ADMIN') {

    ROUTES.forEach(item=>{

       if (item.title!='Demande' && item.title!='Parametrage') {

           this.menuUserItems.push(item);
         }
     });

      this.menuItems = this.menuUserItems;

    }*/


  }



  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
