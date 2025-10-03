import { Siren } from "#utils/helpers";

export type IIGResponse = {
  siren: Siren;
  nomComplet: string;
  etat: string;
  natureJuridique: string;
  activitePrincipale: string;
  libelleActivitePrincipale: string;
  dateCreation: string;
  siege: string;
  association: {
    idAssociation: string | null;
  };
  immatriculation: {
    dateDebutActivite: string;
    dateFin: string;
    duree: 0;
    natureEntreprise: string[];
    dateCloture: string;
    dateImmatriculation: string;
    dateRadiation: string;
    isPersonneMorale: boolean;
    capital: string;
  };
};
