import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from 'rxjs';
import {base_url} from '../app/api/Backend';
import {Users} from '../Model/Users';
import {User} from '../app/auth/user';

@Injectable()
export class UsersServ {

  constructor(private http:HttpClient){}

  addNewUser(user:Users){
    return this.http.post(base_url+'users/addNewUser', user)
  }

  findAllUsers():Observable<Array<Users>>{

    return this.http.get<Array<Users>>(base_url+'users')

  }

  findDivision():Observable<Array<String>>{

    return this.http.get<Array<String>>(base_url+'users/distinct')

  }

  findOneUser(idUser:number):Observable<Users>{

    return this.http.get<Users>(base_url+'users/'+idUser)

  }

  findUserByUserName(userName:string):Observable<Users>{

    return this.http.get<Users>(base_url+'users/'+userName)

  }

  addAttributionToUser(user:Users){
    return this.http.put(base_url+'users', user)
  }

  updateUser(user:Users){
    return this.http.put(base_url+'users', user)
  }

  uploadSignature (userName:string, file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('files', file);

    const req = new HttpRequest('PUT', `${base_url}users/${userName}/upload`, formdata,{
      reportProgress: true, responseType: 'text'
    });

    return this.http.request(req);
  }

}
