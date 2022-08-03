
import {Demande} from './Demande';

export class  ProcessValidation {
   id : number = null;
   division:string = null;
   ordreValidation: number = null;
   statutValidation: boolean = false;
   commentaire:string = "Ok";
   dateValidation:Date;
   demandeProcess: Demande  = new Demande()
}
