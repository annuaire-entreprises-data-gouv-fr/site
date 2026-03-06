interface IAnnonceBodacc {
  datePublication: string;
  details: string;
  numeroAnnonce: number;
  path: string;
  sousTitre: string;
  titre: string;
  tribunal: string;
  typeAvisLibelle: string;
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
