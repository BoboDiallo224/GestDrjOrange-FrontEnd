import { Component, OnInit } from '@angular/core';
import {TypeContratServ} from '../../Service/typeContratServ';
import {TypeContrat} from '../../Model/TypeContrat';
import {Demande} from '../../Model/Demande';

import {UsersServ} from '../../Service/UsersServ';
import {Users} from '../../Model/Users';
import {DemandeServ} from '../../Service/DemandeServ';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {DocumentServ} from '../../Service/DocumentServ';
import {Documents} from '../../Model/Documents';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-traitementDemandeComplement',
  templateUrl: './traitementDemandeComplement.component.html',
  styleUrls: ['./traitementDemandeComplement.component.css']
})
export class TraitementDemandeComplementComponent implements OnInit {

  listTypeContrat:Array<TypeContrat>;
  typeContrat: TypeContrat = new TypeContrat();
  demandes:Demande = new Demande();
  user:Users = new Users();
  selectedFiles: Array<File> = [];
  public loading = false;
  idDemande:number;
  listDocument:Array<Documents> = [];
  isEmpty:boolean = false;
  constructor(private typeContratServ:TypeContratServ, public userServ: UsersServ,
              public demandServ:DemandeServ, private toastr: ToastrService,
              private activatedRoute:ActivatedRoute, private router:Router,
              public documentServ:DocumentServ, private auth:AuthService) {

     this.idDemande = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.findUser();this.findDemandeByIdDemande() ; this.getListDocumentByIdDemande()//this.getListTypeContrat();

  }


  findDemandeByIdDemande(){
    this.demandServ.findDemandeById(this.idDemande).subscribe(
      resp =>{
        //console.log(resp);
        this.demandes = resp;
        this.typeContrat = resp.typeContrat
      },
      error => {
        console.log(error)
      }
    )
  }

  onChangeType(typeContrat:TypeContrat){
      this.typeContrat = typeContrat
  }

  updateDemande(){
    this.loading = true;
    //this.demandes.typeContrat = this.typeContrat;
    //this.demandes.user = this.user;
    this.demandes.statusPrisEnCharge = false;
    this.demandes.statusDemandeComplement = false;
      this.demandServ.updateDemande(this.demandes).subscribe(
        data => {
          if (this.selectedFiles.length != 0) {
            this.uploadDocument(this.demandes.id);
          }

          this.showNotification('top','center');
          this.router.navigateByUrl('demande');
          this.demandes = new Demande();
          this.selectedFiles = null;

          this.getListDocumentByIdDemande();
          this.loading = false;
        },
        error =>{
          console.log(error);
          this.loading = false;
        })

  }


  findUser(){
    this.userServ.findUserByUserName(this.auth.user().username).subscribe(
      data => {
        //console.log(data);
        this.user = data
      },
      error =>{
        console.log(error)
      })
  }

  onSelectFileOut (event) {

    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles[this.selectedFiles.length] = event.target.files.item(0);
      this.isEmpty = false;
    }
    //console.log(this.selectedFiles)
    event.target.value = ''
  }


  getListDocumentByIdDemande(){
    this.documentServ.getListDocumentByIdDemande(this.idDemande).subscribe(
      resp =>{
        this.listDocument = resp;


        //console.log(resp)
      },
      error => {
        console.log(error)
      })
  }

  removeDocsItemFromDatabase(id){
    //console.log("remove from database")
    this.documentServ.removeDocument(id).subscribe(
      resp =>{
        this.showNotification2('top','center', 'Document retirer avec succès');
        this.listDocument = this.listDocument.filter(item => id != item.id);
        this.findDemandeByIdDemande();
      },
      error => {
        console.log(error)
      });
  }

  removeFileItem(i){
    this.selectedFiles = this.selectedFiles.filter( item => i != item);
    this.findDemandeByIdDemande();
    this.isEmpty = false;
  }

  uploadDocument(id:number){
    this.selectedFiles.forEach(item =>{

      this.demandServ.uploadDocuments(id,item).subscribe(
        data => {
          //console.log(data)
        },
        error =>{
          console.log(error)
        });

    })


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

  showNotification2(from, align,message:string){

    this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span>'+message, 'Confirmation', {
      timeOut: 2000,
      enableHtml: true,
      closeButton: true,
      toastClass: "alert alert-info alert-with-icon",
      positionClass: 'toast-' + from + '-' +  align
    });


  }



}
