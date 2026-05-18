export interface IBioResponse {
  items: IBioItem[];
  nbTotal: string;
}

export interface IBioItem {
  activites: Activite[];
  adressesOperateurs: AdressesOperateur[];
  categories: Category[];
  certificats: Certificat[];
  codeNAF?: string;
  dateMaj: string;
  denominationcourante: string;
  email?: string;
  gerant?: string;
  id: number;
  mixite: string;
  numeroBio: number;
  productions: Production[];
  raisonSociale: string;
  reseau: string;
  siret?: string;
  siteWebs: SiteWeb[];
  telephone?: string;
  telephoneCommerciale?: string;
}

export interface Category {
  id: number;
  nom: string;
}

export interface SiteWeb {
  active: boolean;
  id: number;
  operateurId: number;
  typeSiteWeb: TypeSiteWeb;
  typeSiteWebId: number;
  url: string;
}

export interface TypeSiteWeb {
  id: number;
  nom: string;
  status: number;
}

export interface AdressesOperateur {
  active: boolean;
  codeCommune: string;
  codePostal: string;
  departementId: number;
  id: number;
  lat: number;
  lieu: string;
  long: number;
  typeAdresseOperateurs: string[];
  ville: string;
}

export interface Production {
  code: string;
  etatProductions: EtatProduction[];
  id: number;
  nom: string;
}

export interface EtatProduction {
  etatProduction: string;
  id: number;
}

export interface Activite {
  id: number;
  nom: string;
}

export interface Certificat {
  dateArret?: string;
  dateEngagement?: string;
  dateNotification: string;
  dateSuspension?: string;
  etatCertification?:
    | "ARRETEE"
    | "ENGAGEE"
    | "NON ENGAGEE"
    | "SUSPENDUE"
    | null;
  organisme: string;
  url: string;
}
