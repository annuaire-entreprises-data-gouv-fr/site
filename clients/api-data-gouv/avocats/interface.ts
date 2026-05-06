interface IAvocatsDatagouvItem {
  __id: number;
  acDateSerment: null;
  avNom: string;
  avPrenom: string;
  cbAdresse1: string;
  cbAdresse2: string | null;
  cbCp: number;
  cbRaisonSociale: string;
  cbSiretSiren: string;
  cbVille: string;
  NomBarreau: string;
  spLibelle1: null;
  spLibelle2: null;
  spLibelle3: null;
  spLibelle4: string;
}

export interface IAvocatsDatagouvResponse {
  data: IAvocatsDatagouvItem[];
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

interface IAvocat {
  languesParlees: string | null;
  nom: string;
  nomBarreau: string;
  prenom: string;
}

export interface IAvocats {
  avocats: IAvocat[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}
