import { Component, OnInit } from '@angular/core';
import {TypeContratServ} from '../../Service/typeContratServ';
import {TypeContrat} from '../../Model/TypeContrat';
import {Demande} from '../../Model/Demande';
import {UsersServ} from '../../Service/UsersServ';
import {Users} from '../../Model/Users';
import {DemandeServ} from '../../Service/DemandeServ';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../auth/auth.service';
import {ContratServ} from '../../Service/ContratServ';
import {Division} from '../../Model/Division';
import {DivisionServ} from '../../Service/DivisionServ';

@Component({
  selector: 'app-chargement',
  templateUrl: './chargement.component.html',
  styleUrls: ['./chargement.component.css']
})
export class ChargementComponent implements OnInit {

  listTypeContrat:Array<TypeContrat> = [];
  typeContrat: TypeContrat = new TypeContrat();
  demandes:Demande = new Demande();
  user:Users = new Users();
  selectedFiles: Array<File> = [];
  selectedFiles2:FileList;
  currentFileUpload: File;
  public loading = false; listDivision:Array<Division> = []; division:Division = new Division();
  constructor(private typeContratServ:TypeContratServ, public userServ: UsersServ,
              public demandServ:DemandeServ, private toastr: ToastrService,
              private auth:AuthService,public contratServ:ContratServ,
              private divisionServ:DivisionServ) { }

  ngOnInit() {
    this.getListTypeContrat(); this.findUser(); this.findDivisions()
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

  findDivisions(){
    this.divisionServ.findAllDivision().subscribe(
      data => {
        this.listDivision = data;
        this.division = data[0]
      },
      error =>{
        console.log(error)
      })
  }


  onChangeType(typeContrat:TypeContrat){
      this.typeContrat = typeContrat
  }

  async chargeContratNewDemande(){
    this.loading = true;

    this.demandes.typeContrat = this.typeContrat;
    this.demandes.user.division = this.division;

    if (this.selectedFiles.length != 0 && this.selectedFiles2 != null) {

      this.demandes = await this.demandServ.chargeDemande(this.demandes).toPromise();

          if (this.demandes !== null){

            //upload documents
            this.uploadDocument(this.demandes.id);

            //upload Contrat
            this.currentFileUpload = this.selectedFiles2.item(0);

            let contrat = await this.contratServ.uploadSignedContrat(this.demandes.id, this.currentFileUpload,
              this.parse(this.demandes.dateEntreeEnVigueur),
              this.parse(this.demandes.dateFinContrat)).
              toPromise();

            /*await this.contratServ.uploadSignedContrat(this.demandes.id, this.selectedFiles[0],
              this.parse(this.demandes.dateEntreeEnVigueur),
              this.parse(this.demandes.dateFinContrat)).toPromise();*/

            //update demande
            this.demandes.statutHasContrat = true;
            this.demandes.hasSignedContrat = true;
            this.demandes.dateUploadFirstContrat = new Date();
            this.demandes.dateUploadSignedContrat = new Date();
            this.demandes.dateEntreeEnVigueur = this.parse(this.demandes.dateEntreeEnVigueur);
            this.demandes.dateFinContrat = this.parse(this.demandes.dateFinContrat);

            this.updateDemande(this.demandes);

            this.loading = false;
            this.showNotification('top','center');
            this.demandes = new Demande();
            this.selectedFiles = [];//this.currentFileUpload
          }
          else {
            alert("Désolé il n’y a aucune ressource dédié à la gestion de ce type de contrat")
        }

    }
    else {
      alert("Veuillez sélectionner les documents et le contrat");
      this.loading = false
    }

  }

  async updateDemande(demande:Demande){

    await this.demandServ.updateDemande(demande).toPromise();

  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
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

  onSelectFileOutContrat (event) {
    if (event.target.files && event.target.files.length > 0) {
      //this.selectedFiles2[this.selectedFiles2.length] = event.target.files.item(0);
      this.selectedFiles2 = event.target.files;
    }
  }

  async uploadDocument(id:number){

    this.selectedFiles.forEach(item =>{

      let data = this.demandServ.uploadDocuments(id,item).toPromise();

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

  onChangeDivision(division:Division){
    this.division = division
  }


}
