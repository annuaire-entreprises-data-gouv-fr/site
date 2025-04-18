export interface IDataAssociation {
  exId: string;
  idAssociation: string;
  nomComplet: string;
  objet: string;
  telephone: string;
  libelleFamille: string;
  mail: string;
  siteWeb: string;
  utilPublique: boolean;
  impotCommerciaux: boolean;
  regime: string;
  agrement: {
    type: string;
    numero: string;
    niveau: string;
    attributeur: string;
    id: number;
    dateAttribution: string;
  }[];
  formeJuridique: string;
  datePublicationJournalOfficiel: string;
  dateCreation: string;
  dateDissolution: string;
  eligibiliteCEC: boolean;
  adresseSiege: string;
  adresseGestion: string;
  adresseInconsistency: boolean;
  bilans: IBilanFinancierAssociation[];
}

type IBilanFinancierAssociation = {
  dons: number;
  subv: number;
  produits: number;
  charges: number;
  resultat: number;
  year: number;
};

export interface IDataAssociationForAgents {
  documentsRNA: any[];
  documentsDAC: any[];
}
