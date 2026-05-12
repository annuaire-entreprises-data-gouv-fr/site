interface IMinimisDatagouvItem {
  __id: number;
  autorite: string;
  commune_beneficiaire: string;
  date_declaration: string;
  date_octroi: string;
  date_publication: string;
  identifiant_beneficiaire: string;
  instrument_aide: string;
  montant_esb: number;
  nom_beneficiaire: string;
  operateur: string;
  pays_beneficiaire: string;
  regime: string;
  secteur_aide: string;
}

export interface IMinimisDatagouvResponse {
  data: IMinimisDatagouvItem[];
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

interface IMinimisAide {
  autorite: string;
  dateOctroi: string;
  instrumentAide: string;
  montant: number;
  operateur: string;
  regime: string;
  secteurAide: string;
}

export interface IMinimis {
  aides: IMinimisAide[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}
