import { Component, OnInit } from '@angular/core';
import {TypeContratServ} from '../../Service/typeContratServ';
import {TypeContrat} from '../../Model/TypeContrat';
import {Demande} from '../../Model/Demande';
import {UsersServ} from '../../Service/UsersServ';
import {Users} from '../../Model/Users';
import {DemandeServ} from '../../Service/DemandeServ';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-souscription',
  templateUrl: './souscription.component.html',
  styleUrls: ['./souscription.component.css']
})
export class SouscriptionComponent implements OnInit {

  listTypeContrat:Array<TypeContrat> = [];
  typeContrat: TypeContrat = new TypeContrat();
  demandes:Demande = new Demande();
  user:Users = new Users();
  selectedFiles: Array<File> = [];
  public loading = false;
  constructor(private typeContratServ:TypeContratServ, public userServ: UsersServ,
              public demandServ:DemandeServ, private toastr: ToastrService, private auth:AuthService) { }

  ngOnInit() {
    this.getListTypeContrat(); this.findUser();
  }


  getListTypeContrat(){
    this.typeContratServ.getTypeContrat().subscribe(
      resp =>{
        this.listTypeContrat = resp;
        this.typeContrat = this.listTypeContrat[0]
        //console.log(resp)
      },
      error => {
        console.log(error)
      }
    )
  }

  onChangeType(typeContrat:TypeContrat){
      this.typeContrat = typeContrat
  }

  addNewDemande(){
    this.loading = true;
    this.demandes.typeContrat = this.typeContrat;
    this.demandes.user = this.user;
    //console.log(this.demandes)

    if (this.selectedFiles.length != 0) {

      this.demandServ.addNewDemande(this.demandes).subscribe(
        data => {
          if (data !== null){
            this.uploadDocument(data.id);
            this.loading = false;
            this.showNotification('top','center');
            this.demandes = new Demande();
            this.selectedFiles = [];
          }
          else {
            alert("Désolé il n’y a aucune ressource dédié à la gestion de ce type de contrat")
          }
        },
        error =>{
          this.loading = false;
          console.log(error);
        })

    }
    else {
      alert("Veuillez sélectionner les documents");
      this.loading = false
    }


  }


  findUser(){

    this.userServ.findUserByUserName(this.auth.user().username).subscribe(
      data => {
        //console.log(data);
        this.user = data
      },
      error =>{
        console.log(error)
      });
  }

  onSelectFileOut (event) {

    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles[this.selectedFiles.length] = event.target.files.item(0);
    }
    //console.log(this.selectedFiles)
    event.target.value = ''
  }

  uploadDocument(id:number){

    this.selectedFiles.forEach(item =>{

      this.demandServ.uploadDocuments(id,item).subscribe(
        data => {
          console.log(data)
        },
        error =>{
          console.log(error)
        });

    })
  }

  removeFileItem(i){
    this.selectedFiles = this.selectedFiles.filter( item => i != item)
  }

  showNotification(from, align){

      this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span>Enregistrement Reussi avec succès', 'Confirmation', {
        timeOut: 3000,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-' + from + '-' +  align
      });


  }



}
