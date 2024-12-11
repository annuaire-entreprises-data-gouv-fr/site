type IESSItem = {
  SIREN: string; //'923114524';
  "Nom ou raison sociale de l'entreprise": string; //"MAM P'TITE ETOILE";
  "Famille juridique de l'entreprise": string; //'Associations';
  'Code postal': string; //'35390';
  "Libellé de la commune de l'établissement": string; //'GRAND-FOUGERAY';
  "Code du département de l'établissement": string; //'35';
  "Département de l'établissement": string; //'ILLE ET VILAINE';
  "Région de l'établissement": string; //'BRETAGNE';
};

type IESSDatagouvResponse = {
  data: IESSItem[];
  meta: {
    page: number; //1;
    page_size: number; //20
    total: number; //1
  };
};
