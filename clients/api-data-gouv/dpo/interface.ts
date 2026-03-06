interface IDPOItem {
  __id: number;
  "Adresse postale organisme désignant": string;
  "Adresse postale organisme désigné": string;
  "Code NAF organisme désignant": string;
  "Code NAF organisme désigné": string;
  "Code postal organisme désignant": string;
  "Code postal organisme désigné": string;
  "Date de la désignation": string;
  "Moyen contact DPO adresse postale": string;
  "Moyen contact DPO autre": string;
  "Moyen contact DPO code postal": string;
  "Moyen contact DPO email": string;
  "Moyen contact DPO pays": string;
  "Moyen contact DPO téléphone": string;
  "Moyen contact DPO url": string;
  "Moyen contact DPO ville": string;
  "Nom organisme désignant": string;
  "Nom organisme désigné": string;
  "Pays organisme désignant": string;
  "Pays organisme désigné": string;
  "Secteur activité organisme désignant": string;
  "Secteur activité organisme désigné": string;
  "SIREN organisme désignant": string;
  "SIREN organisme désigné": string;
  "Type de DPO": "Personne physique" | "Personne morale";
  "Ville organisme désignant": string;
  "Ville organisme désigné": string;
}

interface IDPODatagouvResponse {
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
}

interface IDPO {
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
  typeDPO: string;
}
