export interface IComptesAssociation {
  comptes: {
    dateparution: string;
    numeroParution: string;
    datecloture: string;
    permalinkUrl: string;
    anneeCloture: string;
  }[];
  lastModified: string | null;
}

export interface IAnnoncesBodacc {
  annonces: {
    titre: string;
    sousTitre: string;
    typeAvisLibelle: string;
    tribunal: string;
    numeroAnnonce: number;
    datePublication: string;
    details: string;
    path: string;
  }[];
  lastModified: string | null;
  procedures: {
    date: string;
    details: string;
  }[];
}

export interface IAnnoncesAssociation {
  annonces: {
    typeAvisLibelle: string;
    numeroParution: string;
    datePublication: string;
    details: string;
    path: string;
  }[];
  lastModified: string | null;
}
