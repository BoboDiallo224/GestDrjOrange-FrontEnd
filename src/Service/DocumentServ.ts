import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {TypeContrat} from '../Model/TypeContrat';
import {base_url} from '../app/api/Backend';
import {Demande} from '../Model/Demande';
import {Documents} from '../Model/Documents';

@Injectable()
export class DocumentServ {

  constructor(private http:HttpClient){}

  addNewDemande(demande:Demande):Observable<any>{

  return this.http.post(base_url+'demandes', demande);

  }

  getListDocumentByIdDemande(idDemande:number):Observable<Array<Documents>>{

    return this.http.get<any>(base_url+'documents/'+idDemande)

  }

  removeDocument(idDemande:number):Observable<any>{

    return this.http.delete(base_url+'documents/removeUpload/'+idDemande)

  }

}
