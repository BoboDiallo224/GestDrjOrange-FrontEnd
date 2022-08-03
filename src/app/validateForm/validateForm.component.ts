import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TypeContratServ} from '../../Service/typeContratServ';
import {TypeContrat} from '../../Model/TypeContrat';
import {Demande} from '../../Model/Demande';
import {UsersServ} from '../../Service/UsersServ';
import {Users} from '../../Model/Users';
import {DemandeServ} from '../../Service/DemandeServ';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AuthService} from '../auth/auth.service';
import {ProcessValidation} from '../../Model/ProcessValidation';
import {HistoriqueRenouvellement} from '../../Model/HistoriqueRenouvellement';
import * as jsPDF from 'jspdf';
import {ActivatedRoute} from '@angular/router';
import {GeneratePdfService} from '../../Service/GeneratePdfService';

@Component({
  selector: 'app-validateForm',
  templateUrl: './validateForm.component.html',
  styleUrls: ['./validateForm.component.css']
})
export class ValidateFormComponent implements OnInit {

  listTypeContrat:Array<TypeContrat> = [];
  typeContrat: TypeContrat = new TypeContrat();
  demandes:Demande = new Demande();
  user:Users = new Users();
  public loading = false;
  ifModif:boolean = true; ifInput:boolean = false;
  listProcess:Array<ProcessValidation> = []; listHistorique:Array<HistoriqueRenouvellement> = [];
  role:string = "";myDate:Date = new Date();
  idDemande:number;

  @ViewChild('content') content: ElementRef;

  constructor(private typeContratServ:TypeContratServ, public userServ: UsersServ,
              public demandServ:DemandeServ, private toastr: ToastrService,
              private modalService: BsModalService, private auth:AuthService,
              private activatedRoute:ActivatedRoute,private pdfGenerateService:GeneratePdfService) {
    this.idDemande = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getCurrentDate();
    this.auth.user().authorities.forEach(
      ele=>{
        this.role = ele.authority;
        //console.log(this.role)
      }
    );
  this. findDemandeByIdDemande();
    this.findProcessByDemande(this.idDemande);

  }

  getCurrentDate(){
    this.myDate = new Date()
  }

 /* findUser(){
    this.userServ.findUserByUserName(this.auth.user().username).subscribe(
      data => {
        //console.log(data);
        this.user = data
      },
      error =>{
        console.log(error)
      })
  }*/

  findProcessByDemande(idDemande){
    this.demandServ.fndProcessByDemande(idDemande).subscribe(
      resp =>{
        this.listProcess = resp;
        //console.log(this.listProcess);
      },
      error => {
        console.log(error)
      }
    )
  }



 /* pdfDeclaration(name:string, content:string,left:number,top:number,imgWidth:number) {
    //this.ifModif= false;
    this.pdfGenerateService.generate(name,content);
  }*/


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

  /*pdfDeclaration() {

    const doc = new jsPDF('p', 'mm', 'a4');
    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const content2 = this.content.nativeElement;

    doc.fromHTML(content2.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    },
      function(bla){doc.save('saveInCallback.pdf');}
    );


    //doc.save('asdfghj' + '.pdf');

  }*/

   convertBase64Image(imageBase64:any,type:string){

    let blob = new Blob([imageBase64], {type: 'image/'+type});

    return new Promise(resolve => {
      new File([blob], 'imageFileName.png');
    })

  }


   pdfDeclaration(name:string, content:string) {
   this.ifModif= false;
   this.pdfGenerateService.generate(name,content);
 }

}
