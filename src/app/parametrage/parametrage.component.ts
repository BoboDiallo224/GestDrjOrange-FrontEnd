import {Component, OnInit, TemplateRef} from '@angular/core';
import {TypeContratServ} from '../../Service/typeContratServ';
import {ToastrService} from 'ngx-toastr';
import {TypeContrat} from '../../Model/TypeContrat';
import {UsersServ} from '../../Service/UsersServ';
import {Users} from '../../Model/Users';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {DivisionServ} from '../../Service/DivisionServ';
import {Division} from '../../Model/Division';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-parametrage',
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.css']
})
export class ParametrageComponent implements OnInit {

  displayOption:string = 'user';
  listTypeContrat:Array<TypeContrat> = []; listUsers:Array<Users> = []; listDivision:Array<Division> = [];
  isUpdate:boolean = false;
  typeContrat:TypeContrat = new TypeContrat(); division:Division = new Division();
  isAttribution:boolean = false;
  user:Users = new Users();
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  public loading = false;
  roles:string; changeRoles:string = "Selectionnez un role";
  constructor(private typeContratServ:TypeContratServ, private toastr: ToastrService,
              public userServ: UsersServ,private modalService: BsModalService,
              private divisionServ:DivisionServ, private auth:AuthService) { }

  ngOnInit() {
    this.auth.user().authorities.forEach(
      ele=>{
        this.roles = ele.authority;
        //console.log(this.role)
      }
    );

    this. getListTypeContrat(); this.findAllUsers()
  }


  onChangeOption(disp:string){
    this.displayOption = disp;
    if (disp == 'user'){
      this.findAllUsers();
      this. getListTypeContrat();
    }
    else{
      this. getListTypeContrat();
      this.typeContrat = new TypeContrat();
    }
  }

  addNewTypeContrat(){

    this.typeContratServ.addNewTypeContrat(this.typeContrat).subscribe(
      res =>{
        //console.log(res)
        this.showNotification('top','center');
        this.getListTypeContrat();
        this.typeContrat = new TypeContrat()
      },
      error =>{
            console.log(error)
      });

  }

  showNotification(from, align){

    if (!this.isUpdate){
      this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span>Enregistrement Reussi avec succès', 'Confirmation', {
        timeOut: 2500,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-' + from + '-' +  align
      });
    }
    else{

      this.toastr.info('<span class="now-ui-icons ui-1_bell-53"></span>Modification Reussi avec succès', 'Confirmation', {
        timeOut: 2500,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-' + from + '-' +  align
      });
    }

  }

  updateTypeContrat(){
    this.typeContratServ.updateTypeContrat(this.typeContrat).subscribe(
      res =>{
        //console.log(res)
        this.showNotification('top','center');
        this.getListTypeContrat();
        this.typeContrat = new TypeContrat()
      },
      error =>{
        console.log(error)
      });

  }

  findAllUsers(){
    this.userServ.findAllUsers().subscribe(
      data => {
        //console.log(data);
        this.listUsers = data
      },
      error =>{
        console.log(error)
      })
  }

  getListTypeContrat(){
    this.typeContratServ.getTypeContrat().subscribe(
      resp =>{
        this.listTypeContrat = resp;
        if (this.displayOption === 'user') {
          this.typeContrat = this.listTypeContrat[0]
        }
        //console.log(resp)
      },
      error => {
        console.log(error)
      }
    )
  }

  onChangeType(typeContrat:TypeContrat){
    this.typeContrat = typeContrat;
   //console.log(typeContrat);
  }

  getUserInfos(user:Users){
    this.user = user;
}

updateUserRole(){

  let array = [this.changeRoles];
  this.user.roles = [this.changeRoles];

  this.userServ.updateUser(this.user).subscribe(
    resp => {

      alert("Modification Reussi avec succès");
      this.getListTypeContrat();
      this.modalRef2.hide()
    },
    error => {
      console.log(error)
    })

}

addAttributionToUser(){
    this.user.typeContrat = this.typeContrat;
    //console.log(this.user);

      this.userServ.addAttributionToUser(this.user).subscribe(
        resp => {

          this.showNotification2('top', 'center');
          this.getListTypeContrat();
          this.isAttribution = false;
          this.modalRef2.hide()
        },
        error => {
          console.log(error)
        })

    //console.log(this.user)
}

  retireAttributionToUser(){
    this.user.typeContrat = null;
    //console.log(this.user);

    this.userServ.addAttributionToUser(this.user).subscribe(
      resp => {

        this.showNotification2('top', 'center');
        this.getListTypeContrat();
        this.isAttribution = false;
        this.modalRef2.hide()
      },
      error => {
        console.log(error)
      })

    //console.log(this.user)
  }

  showNotification2(from, align){

      this.toastr.success('<span class="now-ui-icons ui-1_bell-53"></span>Modification Reussi avec succès', 'Confirmation', {
        timeOut: 2500,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-' + from + '-' +  align
      });
  }

  closeTab(){
    this.isUpdate = false;
    this.typeContrat = new TypeContrat
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

  addNewUser(dataForm){
    this.loading = true;
    //console.log(dataForm);
    dataForm["division"] = this.division;
    dataForm["roles"] = [dataForm["roles"]];

    this.userServ.addNewUser(dataForm).subscribe(
      resp =>{
        this.showNotification('top','center');
        this.findAllUsers();
        this.modalRef.hide();
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error)
      });
  }

  openModal(template: TemplateRef<any>) {
    this.findDivisions();
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' })
      //{ backdrop: 'static', keyboard: false },
    );
    if (this.modalRef2) {
      this.modalRef2.hide()
    }
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });

    if (this.modalRef) {
      this.modalRef.hide()
    }
  }

  closeFirstModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalRef.hide();
    this.modalRef = null;
  }

  closeSecondModal() {
    if (!this.modalRef2) {
      return;
    }
    this.modalRef2.hide();
    this.modalRef2 = null;
  }

  onChangeDivision(division:Division){
    this.division = division
  }

  addNewDivision(dataForm){
    this.divisionServ.addNewDivision(dataForm).subscribe(
      data =>{
        this.showNotification('top','center');
        this.findDivisions();
      },
      error => {
        console.log(error)
      }
    );

  }

  onChangedSelectedRole(selected){

  }

}
