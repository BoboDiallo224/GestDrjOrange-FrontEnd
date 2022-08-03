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
import {DocumentServ} from '../../Service/DocumentServ';
import {Documents} from '../../Model/Documents';
import {ContratServ} from '../../Service/ContratServ';
import {HistoriqueRenouvellement} from '../../Model/HistoriqueRenouvellement';
import {GeneratePdfService} from '../../Service/GeneratePdfService';
import {ExcelService} from '../../Service/ExcelService';
import * as jsPDF from 'jspdf';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contratExistant',
  templateUrl: './contratExistant.component.html',
  styleUrls: ['./contratExistant.component.css']
})
export class ContratExistantComponent implements OnInit {

  listTypeContrat:Array<TypeContrat> = [];

  listDemandeEnCours:Array<Demande> = []; listDemandeExpirer:Array<Demande> = []; listDemandeResilier:Array<Demande> = [];

  typeContrat: TypeContrat = new TypeContrat();

  demandes:Demande = new Demande();user:Users = new Users();

  displayOption:string = 'enCours';

  displayOptionRetour:string = '';

  myDate:Date = new Date();

  selectedFiles: Array<File> = [];

  public loading = false;

  isactivatedOne:boolean = false; isactivatedTwo:boolean = false; isactivatedThree:boolean = false;

  modalRef: BsModalRef; listDocument:Array<Documents> = [];

  ifAllList:boolean; ifModif:boolean = true; ifInput:boolean = false;

  listProcess:Array<ProcessValidation> = []; listHistorique:Array<HistoriqueRenouvellement> = [];

  role:string = "";//ROLE_DEMANDEUR ROLE_ADMIN ROLE_VALIDATEUR
  isValidationForm:boolean = false;

  @ViewChild('content') content: ElementRef;

  constructor(private typeContratServ:TypeContratServ, public userServ: UsersServ,
              public demandServ:DemandeServ, private toastr: ToastrService,
              private modalService: BsModalService, private auth:AuthService,
              public documentServ:DocumentServ,public contratServ:ContratServ,private router:Router,
              private pdfGenerateService:GeneratePdfService, private excelService:ExcelService) { }

  ngOnInit() {

    this.auth.user().authorities.forEach(
      ele=>{
        this.role = ele.authority;
        //console.log(this.role)
      }
    );

    this.getListDemandeEnCours(); this.getListTypeContrat(); this.findUser();

  }

  getCurrentDate(){
    this.myDate = new Date()
  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template,

      Object.assign({}, { class: 'gray modal-lg' })
      //{ backdrop: 'static', keyboard: false },
    );
  }

  openModalConfim(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template,

      Object.assign({ backdrop: 'static', keyboard: false })
      //{ backdrop: 'static', keyboard: false },
    );
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

  onChangeType(event:any){

      if (event === 'tous') {

        this.ifAllList = true
      }

      else {
        this.ifAllList = false;
        this.typeContrat = event
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
      })
  }


  onChangeOption(disp:string){

    this.displayOption = disp;

    if (disp == 'enCours'){

      this.displayOptionRetour = 'enCours';
      this.isactivatedOne = true; this.isactivatedTwo = false; this.isactivatedThree = false;
      this.getListDemandeEnCours();

    }
    else if (disp == 'expirer') {

      this.displayOptionRetour = 'expirer';

      this.isactivatedOne = false; this.isactivatedTwo = true; this.isactivatedThree = false;

      this.getListDemandWithExpiredContrat();

    }

    else if (disp == 'resilier') {
      this.displayOptionRetour = 'resilier';

      this.isactivatedOne = false; this.isactivatedTwo = false; this.isactivatedThree = true;

      this.getListDemandeResilier()
    }

    else if (disp === 'detailDemandeValider'){

      this.findProcessByDemande(this.demandes.id);

    }
  }

   getDemandeInfos(demande) {

    this.demandes = demande;

       this.getListDocumentByIdDemande(demande.id);
  }

  async getListDemandeEnCours(){

    if (this.role == "ROLE_DEMANDEUR" || this.role == "ROLE_GESTIONNAIRE") { //|| this.role == "ROLE_GESTIONNAIRE"

      this.loading = true;

      this.listDemandeEnCours = await this.demandServ.getListDemandEncours(this.auth.user().username).toPromise();

      this.loading = false;
    }

    else if (this.role == "ROLE_ADMIN") {

      this.loading = true;

      this.listDemandeEnCours = await this.demandServ.getListDemandEncours('nan').toPromise();

      this.loading = false;
    }

  }

  async searchListDemandeEnCours(direction){

    if (this.ifAllList) {

      this.getListDemandeEnCours()

    }

    else {

      if (this.role == "ROLE_DEMANDEUR" || this.role == 'ROLE_GESTIONNAIRE') {

        this.loading = true;
        this.demandes.typeContrat = this.typeContrat;
        this.demandes.user.direction = direction.direction;
        this.demandes.user.username = this.auth.user().username;

        this.listDemandeEnCours = await this.demandServ.searchListDemandEncours(this.demandes).toPromise();

        this.loading = false;
      }

      else {

        this.loading = true;

        this.demandes.typeContrat = this.typeContrat;
        this.demandes.user.direction = direction.direction;
        this.demandes.user.username = 'nan';

        this.listDemandeEnCours = await this.demandServ.searchListDemandEncours(this.demandes).toPromise();

        this.loading = false;
      }
    }

  }

  getContratByDemande(idDemande:number){

    this.contratServ.getListContratByIdDemande(idDemande).subscribe(

      resp =>{
        this.showPdf(resp.content)
      })
  }

  showPdf(path:string){

    window.open(path,"_blank");

  }

  async getListDemandeResilier(){

    if (this.role == "ROLE_DEMANDEUR"){

      this.loading = true;

      this.listDemandeResilier = await this.demandServ.getDemandeResilier(this.auth.user().username).toPromise();

      this.loading = false;
    }

    else {

      this.loading = true;

      this.listDemandeResilier = await this.demandServ.getDemandeResilier('nan').toPromise();

      this.loading = false
    }

  }

  async getListDemandWithExpiredContrat(){

    if (this.role == "ROLE_DEMANDEUR" || this.role == "ROLE_GESTIONNAIRE"){

      this.loading = true;
      this.listDemandeExpirer = await this.demandServ.getDemandeExpirer(this.auth.user().username).toPromise();
      this.loading = false;
    }

    else {

      this.loading = true;
      this.listDemandeExpirer = await this.demandServ.getDemandeExpirer('nan').toPromise();
      this.loading = false;

    }

    }

    renouvelementContrat(dataForm){

      if (this.selectedFiles.length != 0) {

        if (this.demandes != null) {

          this.loading = true;
          this.demandes.contratExpired = false;
          this.demandes.contratResilier = false;

          //this.demandes.dateFinContrat = dataForm.value.dateFinContrat;
          //this.demandes.contratExpired = true;

          this.demandServ.renouvelementContrat(this.demandes).subscribe(
            data =>{

              this.uploadDocument(data.id);

              if (this.displayOption === 'expirer') {

                this.getListDemandWithExpiredContrat()

              }

              else {

                this.getListDemandeEnCours();

              }

              this.showNotification('top','center','Contrat renouvelé avec succès');

              this.modalRef.hide();

              this.loading = false;
            },

            error =>{

              console.log(error);
              this.loading = false;

            });
        }

      }

      else {

        alert("Veuillez sélectionner les documents");
        this.loading = false

      }

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

  resilierContrat(dataForm) {

    if (this.demandes != null) {
      this.loading = true;

      this.demandes.contratResilier = true;

      this.demandServ.resilierContrat(this.demandes).subscribe(

        data => {

          this.showNotification('top', 'center', 'Contrat resililier avec succès');

          this.modalRef.hide();

          this.getListDemandeEnCours();

          this.loading = false;
        },

        error => {
          console.log(error);

          this.loading = false;
        });
    }
  }


  rejectResiliationContrat() {

    if (this.demandes != null) {
      this.loading = true;

      this.demandes.contratResilier = false;

      this.demandServ.rejectResiliationContrat(this.demandes).subscribe(

        data => {

          this.showNotification('top', 'center', 'Resililiation du contrat rejeter avec succès');

          this.modalRef.hide();

          this.getListDemandeEnCours();

          this.loading = false;
        },

        error => {

          console.log(error);
          this.loading = false;

        });
    }
  }

  demandeResiliation(){

    this.demandServ.demandeResiliationContrat(this.demandes.id).subscribe(

      data => {

        this.showNotification('top', 'center', 'Demande de résiliation envoyé avec succès');
        this.modalRef.hide();

        this.getListDemandeEnCours();

        this.loading = false;
      },

      error => {

        console.log(error);
        this.loading = false;
      });

  }

  showNotification(from, align, message:String){

    this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span>'+message, 'Confirmation', {

      timeOut: 3000,
      enableHtml: true,
      closeButton: true,
      toastClass: "alert alert-info alert-with-icon",
      positionClass: 'toast-' + from + '-' +  align
    });

  }


  findProcessByDemande(idDemande){

    this.demandServ.fndProcessByDemande(idDemande).subscribe(

      resp =>{
        this.listProcess = resp;
        //console.log(this.listProcess.length);
      },

      error => {
        console.log(error)
      }
    )
  }

  getListDocumentByIdDemande(idDemande:number){

    this.documentServ.getListDocumentByIdDemande(idDemande).subscribe(
      resp =>{

        this.listDocument = resp;
        //console.log(resp)
      },

      error => {
        console.log(error)
      }
    )
  }

  days_between(dateOne, dateTwo) {

    // The number of milliseconds in one day
    let ONE_DAY = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    let date1 = new Date(dateOne);
    let date2 = new Date(dateTwo);

    // Calculate the difference in milliseconds
    let difference_ms = Math.abs(date1.getTime() - date2.getTime());

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);

  }

  getListHistoriqueRenouvellement(id){

    this.contratServ.getListHistoriqueRenouvellement(id).subscribe(

      data =>{
        this.listHistorique = data;
        //console.log(data)
      },
      error => {
        console.log(error)
      })
  }

 /* pdfDeclaration(name:string, content:string,left:number,top:number,imgWidth:number) {
    //this.ifModif= false;
    this.pdfGenerateService.generate(name,content);
  }*/




  pdfDeclaration(name:string, content:string,left:number,top:number,imgWidth:number) {

    const doc = new jsPDF();
    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const content2 = this.content.nativeElement;

    doc.fromHTML(content2.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('asdfghj' + '.pdf');

  }

  onSelectFileOut (event) {

    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles[this.selectedFiles.length] = event.target.files.item(0);
    }

    event.target.value = ''
  }

  removeFileItem(i){

    this.selectedFiles = this.selectedFiles.filter( item => i != item)
  }

  export(){

    if (this.displayOption === "enCours"){

      this.excelService.exportAsExcelFile(this.exportList(this.listDemandeEnCours),

                            "Reporting Contrats en Cours "+new Date())
    }

    else if (this.displayOption === "expirer"){

      this.excelService.exportAsExcelFile(this.exportList(this.listDemandeExpirer),

                            "Reporting Contrats Expirés "+new Date())
    }

    else if (this.displayOption === "resilier"){

      this.excelService.exportAsExcelFile(this.exportList(this.listDemandeResilier),

                             "Reporting en cours de traitement "+new Date())
    }

  }

  exportList(exportList) {

    let listExport: Array<any> = [];

    if (this.displayOption === "enCoursDeTraitement"){

      exportList.forEach(element => {

        if (element.type === "demande") {

          listExport.push({

            "Division": element.data.user.division.libelle,
            "Type Contrat": element.data.typeContrat.libelle,
            "Raison Social": element.data.raisonSocial,
            "Objet Contrat" : element.data.objetContrat,
            "Preavis": element.data.preavis+" Mois",
            "Durée": element.data.duration+" Mois",
            "Modalité de Renouvellement": element.data.modalityRenewal,
            "Montant Prestation":element.data.monthlyAmountPrestation
          })
        }
      });
    }

    else {

      exportList.forEach(element => {

        listExport.push({

          "Division": element.user.division.libelle,
          "Type Contrat": element.typeContrat.libelle,
          "Raison Social": element.raisonSocial,
          "Objet Contrat" : element.objetContrat,
          "Préavis": element.preavis+" Mois",
          "Durée": element.duration+" Mois",
          "Modalité de Renouvellement": element.modalityRenewal,
          "Montant Prestation":element.monthlyAmountPrestation
        })

      });
    }

    return listExport
  }

  displayValidationForm(){

    this.router.navigateByUrl('fiche-validation/'+this.demandes.id)
  }
}
