import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {TypeContrat} from '../Model/TypeContrat';
import {base_url} from '../app/api/Backend';
import {Demande} from '../Model/Demande';
import {ProcessValidation} from '../Model/ProcessValidation';
import {DemandeORProcess} from '../Model/DemandeORProcess';

@Injectable()
export class DemandeServ {

  constructor(private http:HttpClient){}

  addNewDemande(demande:Demande):Observable<any> {

  return this.http.post(base_url+'demandes/saveDemande', demande);

  }

  chargeDemande(demande:Demande):Observable<any> {

  return this.http.post(base_url+'demandes/chargeDemande', demande);

  }

  updateDemande(demande:Demande){

    return this.http.put(base_url+'demandes/'+demande.id, demande)
  }

  uploadDocuments(idDemande: number, file: File){

    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', `${base_url}demandes/upload/${idDemande}`, formdata,{

      reportProgress : true, responseType: 'text'
    });

    return this.http.request(req);

  }

  getListDemandeNonValider(userLogin:string):Observable<Array<Demande>>{

    return this.http.get<any>(base_url+'demandes/list/'+false+'/'+false+'/'+userLogin)
  }

  getListDemandPriseEnCharge(userLogin:string):Observable<Array<Demande>>{

    return this.http.get<any>(base_url+'demandes/list/'+true+'/'+false+'/'+userLogin)
  }

  getListDemandEnCoursTraitement(userLogin:string):Observable<Array<Demande>>{
    //statusPrisEnCharge && ContratApproved
    return this.http.get<any>(base_url+'demandes/list/'+true+'/'+true+'/'+userLogin)
  }

  getListDemandTraiter():Observable<Array<Demande>>{
    //hasSignedContrat,contratExpired,contratResilier
    return this.http.get<any>(base_url+'demandes/list/traiter/'+true+"/"+false+"/"+false)
  }

  getListDemandTraiterByDivision(division:String):Observable<Array<Demande>>{
    //hasSignedContrat
    return this.http.get<any>(base_url+'demandes/listtraiter/byDivision/'+division)
  }

  findDemandeById(id:number):Observable<Demande> {

    return this.http.get<Demande>(base_url+'demandes/'+ id)
  }

  prisEnChargeDemande(demande:Demande):Observable<any> {

    return this.http.put<any>(base_url+'demandes/accept',demande)

  }

  demandeComplementDocs(demande:Demande):Observable<any> {

    return this.http.put<any>(base_url+'demandes/rejet',demande)
}

  beginProcessValidation(listProcess:Array<ProcessValidation>):Observable<any> {

    return this.http.post(base_url+'processValidation/'+listProcess[0].demandeProcess.id, listProcess);

  }

  fndProcessByDemande(idDemande:number):Observable<Array<ProcessValidation>> {

    return this.http.get<Array<ProcessValidation>>(base_url+'processValidation/'+idDemande)
  }

  /*findAllProcessValidation():Observable<Array<ProcessValidation>>{
    return this.http.get<Array<ProcessValidation>>(base_url+'processValidation/listProcessValidation')
  }*/

  contratApproved(demande:Demande):Observable<any> {

    return this.http.put<any>(base_url+'demandes/approved',demande)
  }

  contratDesapproved(idDemande:number, message:String):Observable<any> {

    return this.http.get<any>(base_url+'demandes/sendMail?message='+message+'&idDemande='+idDemande)
  }
  //http://localhost:8090/demandes/sendMail?message=Hassane&idDemande=4

  updateProcessValidation(idDemande:number, division:string, idUser:number, commentaire:string):Observable<any> {

    return this.http.get<any>(base_url+"demandes/"+idDemande+"/"+division+"/"+idUser+"/"+commentaire)
  }

  rejectProcessValidation(idDemande:number, division:string, idUser:number, commentaire:string):Observable<any> {

    return this.http.get<any>(base_url+"demandes/reject/"+idDemande+"/"+division+"/"+idUser+"/"+commentaire)
  }

  async getListDemandeORProcess(data:any):Promise<Array<DemandeORProcess>> {

    let listConcact:Array<DemandeORProcess> = [];   let listProcess:Array<DemandeORProcess> = []; //let process:DemandeORProcess;
    let findListProcess:Array<ProcessValidation>= [];

    if (data.length != 0) {

    for (let item of data) {
    //console.log(item);
      let demande = new DemandeORProcess();

      demande.data = item;
      demande.type = 'demande';

     // console.log(data.length);

     findListProcess = await this.fndProcessByDemande(demande.data.id).toPromise();

     if (findListProcess.length == 0) {
       demande.ifProcessIsEmpty = false;

     }
     else {
       demande.ifProcessIsEmpty = true;
     }

      /*item.processValidation*/
      let listProcess:Array<DemandeORProcess> = [];
      let count:number = 0;

      for (let itemProcess of findListProcess ){

        let process = new DemandeORProcess();

        if (itemProcess.ordreValidation === item.niveauValidation) {

          process.ifNiveauCorrespond = true;
        }

        else {

          process.ifNiveauCorrespond = false;
        }

        if (count == findListProcess.length - 1) {

          //console.log(findListProcess)

          if (findListProcess[count].ordreValidation === item.niveauValidation -1) {
            demande.ifAllUsersHasValidated = true;
          }

          else {

            demande.ifAllUsersHasValidated = false;
          }

        }
         // console.log(demande.ifAllUsersHasValidated);
         process.data = itemProcess;
         process.type = 'process';
          listProcess.push(process);
        count ++;

      }

      listConcact.push(demande);

      listConcact = listConcact.concat(listProcess);
    }

    }
    return listConcact
  }

  getDemandeTreatedAtTime(startDate:string, endDate:string,typeContrat:TypeContrat):Observable<any> {

    return this.http.post<any>(base_url+"demandes/treatedAtTime/"+startDate+"/"+endDate,typeContrat)
  }

  getDemandeTreatedInLate(startDate:string, endDate:string,typeContrat:TypeContrat):Observable<any> {

    return this.http.post<any>(base_url+"demandes/treatedInLate/"+startDate+"/"+endDate, typeContrat)

  }

  getDemandeTreated(startDate:string, endDate:string,typeContrat:TypeContrat):Observable<any> {

    return this.http.post<any>(base_url+"demandes/statistique/"+startDate+"/"+endDate+"/"+true,typeContrat)

  }

  getDemandeNotTreated(startDate:string, endDate:string,typeContrat:TypeContrat):Observable<any> {

    return this.http.post<any>(base_url+"demandes/statistique/"+startDate+"/"+endDate+"/"+false, typeContrat)

  }

  getDemandeByTypeContratAndDirection(demande:Demande):Observable<any> {

    return this.http.post<any>(base_url+"demandes/searchDemandeByTypeContratAndDirection", demande)

  }

  renouvelementContrat(demande:Demande):Observable<any> {

    return this.http.post<any>(base_url+"demandes/renouvelementContrat", demande)

  }

  resilierContrat(demande:Demande):Observable<any> {

    return this.http.post<any>(base_url+"demandes/resilierContrat", demande)

  }

  rejectResiliationContrat(demande:Demande):Observable<any> {

    return this.http.post<any>(base_url+"demandes/reject/resiliationContrat", demande)

  }

  demandeResiliationContrat(id:number):Observable<any> {

    return this.http.get<any>(base_url+"demandes/demandeResiliationContrat/"+id)

  }

  getListDemandEncours(username):Observable<Array<Demande>> {
    //hasSignedContrat,contratExpired,contratResilier
    return this.http.get<any>(base_url+'demandes/demandeEnCours/'+username)
  }

  searchListDemandEncours(demande:Demande):Observable<Array<Demande>> {
    //hasSignedContrat,contratExpired,contratResilier
    return this.http.post<any>(base_url+'demandes/searchDemandeEnCours', demande)
  }

  getDemandeResilier(username):Observable<any> {

    return this.http.get<any>(base_url+"demandes/demandeResilier/"+username)

  }

  getDemandeExpirer(username):Observable<any> {

    return this.http.get<any>(base_url+"demandes/demandeExpirer/"+username)

  }

  /*getListDemandWithExpiredContrat():Observable<Array<Demande>>{
    //hasSignedContrat,contratExpired,contratResilier
    return this.http.get<any>(base_url+'demandes/list/traiter/'+true+"/"+true+"/"+false)
  }*/


}
