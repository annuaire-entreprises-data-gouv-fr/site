interface IAnnonceBodacc {
  titre: string;
  sousTitre: string;
  typeAvisLibelle: string;
  tribunal: string;
  numeroAnnonce: number;
  datePublication: string;
  details: string;
  path: string;
}
[];

export interface IAnnoncesBodacc {
  annonces: IAnnonceBodacc[];
  comptes: IAnnonceBodacc[];
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
