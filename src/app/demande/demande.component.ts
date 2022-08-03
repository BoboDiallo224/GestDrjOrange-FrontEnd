import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Demande} from '../../Model/Demande';
import {UsersServ} from '../../Service/UsersServ';
import {DemandeServ} from '../../Service/DemandeServ';
import {ToastrService} from 'ngx-toastr';
import {DocumentServ} from '../../Service/DocumentServ';
import {Router} from '@angular/router';
import {Documents} from '../../Model/Documents';
import {ProcessValidation} from '../../Model/ProcessValidation';
import {ContratServ} from '../../Service/ContratServ';
import {DialogComponent} from '@syncfusion/ej2-angular-popups';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Users} from '../../Model/Users';
import {DemandeORProcess} from '../../Model/DemandeORProcess';
import {DivisionServ} from '../../Service/DivisionServ';
import {TypeContrat} from '../../Model/TypeContrat';
import {TypeContratServ} from '../../Service/typeContratServ';
import {AuthService} from '../auth/auth.service';
import {__await} from 'tslib';
import {GeneratePdfService} from '../../Service/GeneratePdfService';
import {ExcelService} from '../../Service/ExcelService';
//import {GeneratePdfService} from '../../Service/GeneratePdfService';


@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css']
})
export class DemandeComponent implements OnInit {

  //Upload contrat
  selectedFiles: Array<File> = [];
  listProcess:Array<ProcessValidation> = [];
  processValidation:ProcessValidation = new ProcessValidation();
  selectedDivisions:Array<string> = [];
  items:Array<String> = [];
  isBeginProcess:boolean = true; isDisplayUser:boolean = false;
  listDemandeORProcess:Array<DemandeORProcess> = [];
  listTypeContrat:Array<TypeContrat> = [];
  typeContrat:TypeContrat = new TypeContrat();
  displayOption:string = 'non_valider';  displayOptionRetour:string = '';
  listDemandeNonPriseEnCharge:Array<Demande> = []; listDocument:Array<Documents> = [];
  listDemandePrisEncharge:Array<Demande> = [];listDemandeTraiter:Array<Demande> = []; listDemandeValidateur:Array<Demande> = [];
  demandes:Demande = new Demande();
  btnShowComplement:boolean = false;
  public loading = false; isComplement:boolean;
  role:string = "";//ROLE_DEMANDEUR ROLE_ADMIN ROLE_VALIDATEUR
  modalRef: BsModalRef;
  user:Users = new Users();
  ifUserDivision:boolean = false; ifModif:boolean = true; ifInput:boolean = false;
  isactivatedOne:boolean = true;isactivatedTwo:boolean = false;isactivatedThree:boolean = false; isactivatedFour:boolean = false;
  myDate = new Date();
  isChecked:boolean = false;
  p: number = 1;
  constructor(public demandServ:DemandeServ, private toastr: ToastrService,
              public documentServ:DocumentServ, private router:Router,
              public userServ: UsersServ, public contratServ:ContratServ,
              private modalService: BsModalService, private divisionServ:DivisionServ,
              private typeContratServ:TypeContratServ, private auth:AuthService,
              private pdfGenerateService:GeneratePdfService, private excelService:ExcelService)//
                { }

  ngOnInit() {

    this.auth.user().authorities.forEach(
      ele=>{
        this.role = ele.authority;
        //console.log(this.role)
      }
    );

    this.getListDemandNonPriseEnCharge(); this.findUser();

    if (this.role == 'ROLE_VALIDATEUR') {
      this.displayOption = 'valider';
      this. getListDemandORProcess(); //this.findUser()
    }
  }

  getCurrentDate(){
    this.myDate = new Date()
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

  changeRole(role:string){
    this.role = role
  }

  async getListDemandNonPriseEnCharge(){

    if (this.role == 'ROLE_DEMANDEUR' || this.role == 'ROLE_GESTIONNAIRE') {

      this.loading = true;
      this.listDemandeNonPriseEnCharge = await this.demandServ.getListDemandeNonValider(this.auth.user().username).toPromise();
      this.loading = false;
    }

    else {

      this.loading = true;
      this.listDemandeNonPriseEnCharge  = await this.demandServ.getListDemandeNonValider('nan').toPromise();
      this.loading = false;
    }

  }

  async getListDemandPriseEnCharge(){

    if (this.role == 'ROLE_DEMANDEUR' || this.role == 'ROLE_GESTIONNAIRE') {

      this.loading = true;
      this.listDemandePrisEncharge = await this.demandServ.getListDemandPriseEnCharge(this.auth.user().username).toPromise();
      this.loading = false;
    }
    else {

      this.loading = true;
      this.listDemandePrisEncharge = await this.demandServ.getListDemandPriseEnCharge('nan').toPromise();
      this.loading = false;
    }

  }

  async getListDemandORProcess() {
    let data;
    
    if (this.role == "ROLE_DEMANDEUR" || this.role == 'ROLE_GESTIONNAIRE') {

       data = await this.demandServ.getListDemandEnCoursTraitement(this.auth.user().username).toPromise();
       //console.log("okokok")
    }
    else {

       data = await this.demandServ.getListDemandEnCoursTraitement("nan").toPromise();
    }

    this.loading = true;
    this.listDemandeORProcess = await this.demandServ.getListDemandeORProcess(data);
    this.loading = false;
  }

  async getListDemandeTraiter(){
    this.loading = true;
    this.listDemandeTraiter = await this.demandServ.getListDemandTraiter().toPromise();
    this.loading = false;
  }

  async getListDemandeTraiterByDivision(division:String){
    this.loading = true;
    this.listDemandeTraiter = await this.demandServ.getListDemandTraiterByDivision(division).toPromise();
    this.loading = false;

  }

  async searchContratByTypeAndDirection(direction){
    this.loading = true;

    this.demandes.typeContrat = this.typeContrat;
    this.demandes.user.direction = direction.direction;

    this.listDemandeTraiter = await this.demandServ.getDemandeByTypeContratAndDirection(this.demandes).toPromise();
    this.loading = false

  }

  async getDemandeInfos(demande) {
      this.demandes = demande;

      if (this.role == "ROLE_VALIDATEUR") {

      }
      else {
        this.getListDocumentByIdDemande(demande.id);
      }

  }

  async getDemandeInfos2(demande) {
    this.demandes = demande;


    if (this.role == "ROLE_VALIDATEUR") {

    }
    else {
      this.getListDocumentByIdDemande(demande.id);
    }

  }

  async getDemandeInfosFORValid(demande,displayOption) {

    if (this.role === "ROLE_VALIDATEUR"){

      if (displayOption === "detailDemandeValider") {
        this.demandes = demande;
        this.getListDocumentByIdDemande(demande.id);
      }
      else {
        this.demandes = demande.demandeProcess;
        this.getListDocumentByIdDemande(demande.demandeProcess.id);
      }
    }

  }

  onChangeOption(disp:string){
    this.displayOption = disp;
    if (disp == 'non_valider'){

      this.displayOptionRetour = 'non_valider';
      this.getListDemandNonPriseEnCharge();
      this.isactivatedOne = true;  this.isactivatedTwo = false;  this.isactivatedThree = false; this.isactivatedFour = false
    }
    else if (disp == 'detailDemandeValider'){

      this.findDivisions();
      if (this.demandes.id != null)
      this.findProcessByDemande(this.demandes.id);
      //console.log(this.demandes)

    }
    else if (disp == 'valider') {

      this.displayOptionRetour = 'valider';

      if (this.role == 'ROLE_ADMIN' || this.role == 'ROLE_DEMANDEUR' ||
          this.role == 'ROLE_GESTIONNAIRE'){

        this. getListDemandPriseEnCharge()
      }
      else if (this.role == 'ROLE_VALIDATEUR') {

        this. getListDemandORProcess();
      }
      this.isactivatedOne = false;  this.isactivatedTwo = true;  this.isactivatedThree = false; this.isactivatedFour = false
    }

    else if (disp == 'enCoursDeTraitement') {

      this.displayOptionRetour = 'enCoursDeTraitement';

      if (this.role === "ROLE_ADMIN") {
       this.getListDemandORProcess();
      }
      else {

        this. getListDemandORProcess();
      }
      //console.log("after")
      //this.findAllProcessValidation()
      this.isactivatedOne = false;  this.isactivatedTwo = false;  this.isactivatedThree = true; this.isactivatedFour = false
    }
    else if (disp == 'traiter'){

      if (this.role == 'ROLE_DEMANDEUR') {
        //|| this.role == 'ROLE_VALIDATEUR'
        this.displayOptionRetour = 'traiter';
        this.isactivatedOne = false;  this.isactivatedTwo = false;  this.isactivatedThree = false; this.isactivatedFour = true;

        this.getListDemandeTraiterByDivision(this.user.division.libelle)
      }

      else {
        this.displayOptionRetour = 'traiter';
        this.isactivatedOne = false;  this.isactivatedTwo = false;  this.isactivatedThree = false; this.isactivatedFour = true;
        this.getListDemandeTraiter();
      }

      this.getListTypeContrat();

    }
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

  showPdf(path:string){

    window.open(path,"_blank");

  }

  prisEnChargeDemande(){
    if (this.demandes != null){

      this.loading = true;
      this.demandes.statusPrisEnCharge = true;

    this.demandServ.prisEnChargeDemande(this.demandes).subscribe(
      data =>{
        this.modalRef.hide();
        this.showNotification('top','center','Pris En Charge Effectuer avec succès');
        this.getListDemandNonPriseEnCharge();
        this.displayOption = 'valider';
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      })
    }
    else {
      alert("Impossible la demande est est vide");
      this.loading = false;
    }
  }

  demandeComplement(){
    this.loading = true;
    this.demandes.statusPrisEnCharge = false;
    this.demandes.statusDemandeComplement = true;
    this.demandServ.demandeComplementDocs(this.demandes).subscribe(
      data =>{
          this.showNotification2('top','center');
          this.demandes.remarqueComplement = null;
          this.btnShowComplement = false;
        this.findDemandeByIdDemande();
        this.loading = false;
      },
      error => {
        console.log(error)
      }
    )
  }

  findDemandeByIdDemande(){
    this.demandServ.findDemandeById(this.demandes.id).subscribe(
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

  closeCard(){
    this.btnShowComplement = false;
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

  showNotification2(from, align){

    this.toastr.info('<span class="now-ui-icons ui-1_bell-53"></span>Demande de complement envoyer avec succès', 'Confirmation', {
      timeOut: 3000,
      enableHtml: true,
      closeButton: true,
      toastClass: "alert alert-info alert-with-icon",
      positionClass: 'toast-' + from + '-' +  align
    });
  }

  openTraitrementComplement(id:number){
    this.router.navigate(['demandeComplement/', id])
  }

  //....................................NG SELECT....................................................................

  findDivisions(){
    this.divisionServ.findAllDivision().subscribe(
      data => {
        data.forEach(element =>{
          this.items.push(element.libelle);
        });
        //console.log(this.items)
      },
      error =>{
        console.log(error)
      })
  }


  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.text;
      }).join(',');
  }

  ifRepeat(event:any){
    //console.log(event.target.value)
    //this.selectedDivisions.filter( => )
  }

  beginProcess(){

    if (this.demandes != null && this.selectedDivisions.length != 0) {
      this.loading = true;
      this.selectedDivisions.forEach(value => {

        let process:ProcessValidation = new ProcessValidation();

        process.division = value;
        process.demandeProcess = this.demandes;

        this.listProcess.push(process)
        });

      this.demandServ.beginProcessValidation(this.listProcess).subscribe(
        resp =>{
          //console.log(resp);
          this.isBeginProcess = false;
          this.findProcessByDemande(this.demandes.id);
          this.loading = false;
          this.modalRef.hide()
        },
        error =>{
            console.log(error);
          this.loading = false;
        });
      //console.log(this.listProcess)
    }
    else {
      alert("Oups vous essayez d'inseré un objet vide")
    }
  }

  findProcessByDemande(idDemande){
    this.demandServ.fndProcessByDemande(idDemande).subscribe(
      resp =>{
        this.listProcess = resp;
        if (this.listProcess.length != 0){
          this.isBeginProcess = false;
          this.isDisplayUser = true;
        }
        else {
          this.isBeginProcess = true;
          this.isDisplayUser = false;
          //console.log("okok");
        }
      },
      error => {
        console.log(error)
      }
    )
  }


  onSelectFileOut (event, id:number) {

    if (event.target.files && event.target.files.length > 0) {

      this.selectedFiles[this.selectedFiles.length] = event.target.files.item(0);

      if ((this.role === 'ROLE_ADMIN' || this.role === 'ROLE_GESTIONNAIRE') && this.displayOption !== 'enCoursDeTraitement') {
        console.log(this.displayOption);
        this.uploadContrat(id);
      }

    }
    //console.log(this.selectedFiles)
    event.target.value = ''

  }

  async uploadContrat(id:number){
    this.loading = true;
      let data = await this.contratServ.uploadContrat(id, this.selectedFiles[0]).toPromise();
    this.getListDemandPriseEnCharge();
    this.loading =  false;
    this.showNotification('top','center','Contrat uploader avec succès');
    this.selectedFiles = [];
  }

   async uploadSignedContrat(dataForm){

    if (this.demandes.id != null && this.selectedFiles.length != 0){
      this.loading = true;

     await this.contratServ.uploadSignedContrat(this.demandes.id, this.selectedFiles[0],
                                                this.parse(dataForm.value.dateEntreeEnVigueur),
                                                this.parse(dataForm.value.dateFinContrat)).toPromise();

      this.showNotification('top','center','Contrat uploader avec succès');

      this.demandes.dateEntreeEnVigueur = this.parse(dataForm.value.dateEntreeEnVigueur);
      this.demandes.dateFinContrat = this.parse(dataForm.value.dateFinContrat);
      this.demandes.hasSignedContrat = this.isChecked;
      this.demandes.dateUploadSignedContrat = new Date();

      this.updateDemande(this.demandes);

      this.getListDemandORProcess();

      this.selectedFiles = []; this.isChecked = false; this.modalRef.hide(); this.loading = false

    }

    else {

      alert("Oups vous essayez d'inserer un objet vide. Veuillez selectionné la version signée du contrat à uploader")
    }
  }

  updateDemande(demande:Demande){

    this.demandServ.updateDemande(demande).subscribe(
      data => {

      },
      error =>{
        console.log(error);
      })

  }

  getContratByDemande(idDemande:number){

    this.contratServ.getListContratByIdDemande(idDemande).subscribe(
      resp =>{
        this.showPdf(resp.content)
      }
    )
  }

  approvedContrat(){
    //console.log(this.demandes);
    if (this.demandes != null){
      this.loading = true;

      this.demandes.contratApproved = true;

      this.demandServ.contratApproved(this.demandes).subscribe(
        resp => {
          this.showNotification('top','center', "Contrat approuvé avec succès");
          this.loading = false;
          this. getListDemandPriseEnCharge();
          this.modalRef.hide();
        },
        error => {
          console.log(error);
          this.loading = false
        })
    }
  }

  async contratDesapproved(dataForm){

    if (this.demandes != null){
      this.loading = true;

    this.demandServ.contratDesapproved(this.demandes.id, dataForm.message).subscribe(
      resp =>{
        this.showNotification('top','center', "Mail envoyer avec succés");
        this. getListDemandPriseEnCharge();
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      });
      this.modalRef.hide();
    }

  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' })
    //{ backdrop: 'static', keyboard: false },
    );
  }

  openModalConfirmation(confimContratApproved: TemplateRef<any>) {

    this.modalRef = this.modalService.show(confimContratApproved,{ backdrop: 'static', keyboard: false });
  }

  async findUser(){

    this.user = await this.userServ.findUserByUserName(this.auth.user().username).toPromise();
    //console.log(this.user.division.libelle)
  }

  updateProcessValidation(){

    this.loading = true;

   this.demandServ.updateProcessValidation(this.demandes.id, this.user.division.libelle, this.user.id,
                                           this.processValidation.commentaire).subscribe(
     resp =>{
       this.showNotification('top','center',"Demande valider avec succès");
       this. getListDemandORProcess();
       this.loading = false;
       this.ifUserDivision = false;
       this.modalRef.hide();
     },
     error => {
       this.loading = false;
       console.log(error)
     })

    /*this.demandServ.okk().subscribe(
      data =>{

      }
    )*/
  }

  rejectProcessValidation(dataForm){

   let commentaire:string = dataForm.commentaire;
   this.loading = true;
   this.demandServ.rejectProcessValidation(this.demandes.id, this.user.division.libelle, this.user.id, commentaire).subscribe(
     resp =>{
       this.showNotification('top','center',"Demande réjetée avec succès " +
         "et votre commentaire a été envoyer par email");
       this. getListDemandORProcess();
       this.loading = false;
       this.ifUserDivision = false;
       this.modalRef.hide();
     },
     error => {
       this.loading = false;
       console.log(error)
     })

   /* this.demandServ.okk().subscribe(
      data =>{

      }
    )*/
  }


   getListTypeContrat(){

    this.typeContratServ.getTypeContrat().subscribe(
      resp =>{
        this.listTypeContrat = resp;
        this.typeContrat = this.listTypeContrat[0];
      },
      error => {
        console.log(error)
      }
    )

  }


  onChangeType(typeContrat:TypeContrat){
    this.typeContrat = typeContrat
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

  pdfDeclaration(name:string, content:string,left:number,top:number,imgWidth:number) {
    this.pdfGenerateService.generate(name,content);
  }

  export(){

    if (this.displayOption === "non_valider"){
      this.excelService.exportAsExcelFile(this.exportList(this.listDemandeNonPriseEnCharge),"Reporting non prises en charge"+new Date())
    }

    else if (this.displayOption === "valider"){
      this.excelService.exportAsExcelFile(this.exportList(this.listDemandePrisEncharge),"Reporting pris en charge"+new Date())
    }

    else if (this.displayOption === "enCoursDeTraitement"){
      this.excelService.exportAsExcelFile(this.exportList(this.listDemandeORProcess),"Reporting en cours de traitement "+new Date())
    }

    else if (this.displayOption === "traiter") {
      this.excelService.exportAsExcelFile(this.exportList(this.listDemandeTraiter),"Reporting traitées "+new Date())
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
