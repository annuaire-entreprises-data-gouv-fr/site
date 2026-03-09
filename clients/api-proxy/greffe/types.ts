import type { Siren } from "#utils/helpers";

export interface IIGResponse {
  activitePrincipale: string;
  association: {
    idAssociation: string | null;
  };
  dateCreation: string;
  etat: string;
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
  libelleActivitePrincipale: string;
  natureJuridique: string;
  nomComplet: string;
  siege: string;
  siren: Siren;
}
