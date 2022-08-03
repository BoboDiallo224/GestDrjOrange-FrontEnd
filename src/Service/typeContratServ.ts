import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {TypeContrat} from '../Model/TypeContrat';
import {base_url} from '../app/api/Backend';

@Injectable()
export class TypeContratServ {

  constructor(private http:HttpClient){}

  addNewTypeContrat(type:TypeContrat):Observable<any>{

  return this.http.post<any>(base_url+'typeContrats', type)

  }

  getTypeContrat():Observable<Array<TypeContrat>>{

    return this.http.get<any>(base_url+'typeContrats')

  }

  updateTypeContrat(type:TypeContrat):Observable<any>{

    return this.http.put<any>(base_url+'typeContrats', type)

  }

}
