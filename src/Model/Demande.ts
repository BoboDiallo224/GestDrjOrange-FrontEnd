import {Users} from './Users';
import {TypeContrat} from './TypeContrat';
import {Documents} from './Documents';
import {ProcessValidation} from './ProcessValidation';

export class  Demande {
   id :number;
   raisonSocial: string=null;
   objetContrat: string=null;
   dateEntreeEnVigueur: Date =null;
  datePrisEnchargeDemande: Date =null;
  dateUploadSignedContrat: Date =null;
  dateUploadFirstContrat: Date =null;
  dateFinContrat: Date =null;
  dateSouscription: Date =null;
  dateResiliationContrat: Date =null;
   duration: number = null;
   preavis:string;
   modalityRenewal: string=null;
   monthlyAmountPrestation: string;
  statusDemandeComplement: boolean = false;
  statusPrisEnCharge: boolean = false;
  remarqueComplement:string = null;
  niveauValidation:number = null;
  statutHasContrat:boolean = false;
  hasSignedContrat:boolean = false;
  user:Users  = new Users();
  typeContrat:TypeContrat = new TypeContrat();
  documents:Documents = new Documents();
  processValidation:Array<ProcessValidation> = [];
  contratApproved:boolean = false;
  contratExpired: Boolean=false;
  contratResilier:boolean = false;
  parent:Demande = null;

  confirmRenewalStatus:boolean = false;

}
