interface IESSItem {
  "Code du département de l'établissement": string; //'35';
  "Code postal": string; //'35390';
  "Département de l'établissement": string; //'ILLE ET VILAINE';
  "Famille juridique de l'entreprise": string; //'Associations';
  "Libellé de la commune de l'établissement": string; //'GRAND-FOUGERAY';
  "Nom ou raison sociale de l'entreprise": string; //"MAM P'TITE ETOILE";
  "Région de l'établissement": string; //'BRETAGNE';
  SIREN: string; //'923114524';
}

interface IESSDatagouvResponse {
  data: IESSItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
}
