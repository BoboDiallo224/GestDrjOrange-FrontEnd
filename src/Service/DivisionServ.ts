import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {base_url} from '../app/api/Backend';
import {Users} from '../Model/Users';
import {Division} from '../Model/Division';

@Injectable()
export class DivisionServ {

  constructor(private http:HttpClient){}

  findAllDivision():Observable<Array<Division>>{

    return this.http.get<Array<Division>>(base_url+'divisions')

  }

  addNewDivision(division:Division):Observable<any>{

    return this.http.post<any>(base_url+'divisions',division)

  }


}
