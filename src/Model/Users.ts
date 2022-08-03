import {TypeContrat} from './TypeContrat';
import {Division} from './Division';

export class  Users {

  id :number;
  name: string;
  username: string;
  password : string;
  email : string;
  roles:Array<string> = [];
  division: Division = new Division();
  direction:string;
  typeContrat:TypeContrat = null;
  typeImageSignature:string;
  contentImageSignature:string;

}
