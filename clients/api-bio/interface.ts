export type IBioResponse = {
  nbTotal: string;
  items: Item[];
};

export type Item = {
  id: number;
  raisonSociale: string;
  denomination?: string;
  siret?: string;
  numeroBio: number;
  telephone?: string;
  email?: string;
  codeNAF?: string;
  gerant?: string;
  dateMaj: string;
  telephoneCommerciale?: string;
  reseau: string;
  categories: Category[];
  siteWebs: SiteWeb[];
  adressesOperateurs: AdressesOperateur[];
  productions: Production[];
  activites: Activite[];
  certificats: Certificat[];
  mixite: string;
};

export type Category = {
  id: number;
  nom: string;
};

export type SiteWeb = {
  id: number;
  url: string;
  active: boolean;
  operateurId: number;
  typeSiteWebId: number;
  typeSiteWeb: TypeSiteWeb;
};

export type TypeSiteWeb = {
  id: number;
  nom: string;
  status: number;
};

export type AdressesOperateur = {
  id: number;
  lieu: string;
  codePostal: string;
  ville: string;
  lat: number;
  long: number;
  codeCommune: string;
  active: boolean;
  departementId: number;
  typeAdresseOperateurs: string[];
};

export type Production = {
  id: number;
  code: string;
  nom: string;
  etatProductions: EtatProduction[];
};

export type EtatProduction = {
  id: number;
  etatProduction: string;
};

export type Activite = {
  id: number;
  nom: string;
};

export type Certificat = {
  organisme: string;
  etatCertification?:
    | 'ARRETEE'
    | 'ENGAGEE'
    | 'NON ENGAGEE'
    | 'SUSPENDUE'
    | null;
  dateSuspension?: string;
  dateArret?: string;
  dateEngagement?: string;
  dateNotification: string;
  url: string;
};
