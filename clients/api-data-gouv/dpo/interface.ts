type IDPOItem = {
  __id: number;
  'SIREN organisme désignant': string;
  'Nom organisme désignant': string;
  'Secteur activité organisme désignant': string;
  'Code NAF organisme désignant': string;
  'Adresse postale organisme désignant': string;
  'Code postal organisme désignant': string;
  'Ville organisme désignant': string;
  'Pays organisme désignant': string;
  'Type de DPO': 'Personne physique' | 'Personne morale';
  'Date de la désignation': string;
  'SIREN organisme désigné': string;
  'Nom organisme désigné': string;
  'Secteur activité organisme désigné': string;
  'Code NAF organisme désigné': string;
  'Adresse postale organisme désigné': string;
  'Code postal organisme désigné': string;
  'Ville organisme désigné': string;
  'Pays organisme désigné': string;
  'Moyen contact DPO email': string;
  'Moyen contact DPO url': string;
  'Moyen contact DPO téléphone': string;
  'Moyen contact DPO adresse postale': string;
  'Moyen contact DPO code postal': string;
  'Moyen contact DPO ville': string;
  'Moyen contact DPO pays': string;
  'Moyen contact DPO autre': string;
};

type IDPODatagouvResponse = {
  data: IDPOItem[];
  links: {
    profile: string;
    swagger: string;
    next: string;
    prev: string;
  };
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
};

type IDPO = {
  typeDPO: string;
  organismeDesigne: {
    siren: string;
    nom: string;
    secteurActivite: string;
    codeNAF: string;
    adressePostale: string;
    codePostal: string;
    ville: string;
    pays: string;
  };
  contact: {
    email: string;
    url: string;
    telephone: string;
    adressePostale: string;
    codePostal: string;
    ville: string;
    pays: string;
    autre: string;
  };
};
