interface IAidesADEMEDatagouvItem {
  __id: number;
  conditionsVersement: string;
  dateConvention: string;
  datesPeriodeVersement: string;
  dispositifAide: string | null;
  idAttribuant: string;
  idBeneficiaire: string;
  idRAE: string;
  montant: number;
  "Nom de l attribuant": string;
  nature: string;
  nomBeneficiaire: string;
  notificationUE: boolean;
  objet: string;
  referenceDecision: string;
}

export interface IAidesADEMEDatagouvResponse {
  data: IAidesADEMEDatagouvItem[];
  links: {
    profile: string;
    swagger: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}

interface IAidesADEMEAide {
  conditionsVersement: string;
  dateConvention: string;
  datesPeriodeVersement: string;
  dispositifAide: string | null;
  idBeneficiaire: string;
  montant: number;
  nature: string;
  nomAttribuant: string;
  nomBeneficiaire: string;
  objet: string;
  referenceDecision: string;
}

export interface IAidesADEME {
  aides: IAidesADEMEAide[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}
