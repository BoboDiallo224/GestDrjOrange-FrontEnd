import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {TypeContrat} from '../Model/TypeContrat';
import {base_url} from '../app/api/Backend';
import {Demande} from '../Model/Demande';
import {Documents} from '../Model/Documents';
import {Contrat} from '../Model/Contrat';

@Injectable()
export class ContratServ {

  constructor(private http:HttpClient){}

  uploadContrat(idDemande: number, file: File){
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', `${base_url}contrats/upload/${idDemande}`, formdata,{
      reportProgress: true, responseType: 'text'
    });
    return this.http.request(req);
  }

  getListContratByIdDemande(idDemande:number):Observable<Contrat>{

    return this.http.get<any>(base_url+'contrats/'+idDemande)

  }

  uploadSignedContrat(idDemande: number, file: File,dateEntreVigueur:Date,dateFinContrat:Date){
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', `${base_url}contrats/uploadContratSinged/${idDemande}/${dateEntreVigueur}/${dateFinContrat}`, formdata,{
      reportProgress: true, responseType: 'text'
    });

    return this.http.request(req);
  }

  /*getListHistoriqueRenouvellement(idDemande:number):Observable<any>{
    return this.http.get<any>(base_url+"historiques/"+idDemande)
  }*/

  getListHistoriqueRenouvellement(idDemande:number):Observable<any>{
    return this.http.get<any>(base_url+"demandes/historique/"+idDemande)
  }


  /*
  removeDocument(idDemande:number):Observable<any>{

    return this.http.delete(base_url+'documents/removeUpload/'+idDemande)

  }*/

}
