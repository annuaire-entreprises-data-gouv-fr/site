export interface IDataAssociation {
  adresseGestion: string;
  adresseInconsistency: boolean;
  adresseSiege: string;
  agrement: {
    type: string;
    numero: string;
    niveau: string;
    attributeur: string;
    id: number;
    dateAttribution: string;
  }[];
  bilans: IBilanFinancierAssociation[];
  dateCreation: string;
  dateDissolution: string;
  datePublicationJournalOfficiel: string;
  eligibiliteCEC: boolean;
  exId: string;
  formeJuridique: string;
  idAssociation: string;
  impotCommerciaux: boolean;
  libelleFamille: string;
  nomComplet: string;
  objet: string;
  regime: string;
  siteWeb: string;
  utilPublique: boolean;
}

interface IBilanFinancierAssociation {
  charges: number;
  dons: number;
  produits: number;
  resultat: number;
  subv: number;
  year: number;
}

export interface IDataAssociationForAgents {
  documentsDAC: any[];
  documentsRNA: any[];
}
