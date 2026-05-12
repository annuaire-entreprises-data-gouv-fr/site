import { clientApiEntrepriseAssociation } from "#/clients/api-entreprise/association";
import type { IAPINotRespondingError } from "#/models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#/models/authentication/user/rights";
import { verifySiren } from "#/utils/helpers";
import { handleApiEntrepriseError } from "../utils";

interface IDocumentAssociation {
  date_depot: string; //'2019-01-01';
  id: string;
  type: string; //'Budget prévisionnel';
  url: string;
}

type IDocumentDAC = IDocumentAssociation & {
  annee_validite: string; //'2019';
  commentaire: string; //'Les comptes annuels sont consolidés au niveau national';
  etat: string; //'courant';
  nom: string; //'Rapport annuel 2019.pdf';
  etablissement: IAssociationEtablissement;
};

type IDocumentRNA = IDocumentAssociation & {
  annee_depot: string; //'2019';
  sous_type: {
    code: string; //'STC';
    libelle: string; //'Statuts';
  };
};

interface IAssociationDirigeant {
  civilite: string;
  courriel: string;
  etablissement: IAssociationEtablissement;
  fonction: string;
  nom: string;
  prenom: string;
  publication_internet: boolean;
  telephone: string;
  valideur_cec: boolean;
}

export interface IAssociationEtablissement {
  adresse: string;
  siege: boolean;
  siret: string;
}

export interface IAssociationProtected {
  dirigeants: IAssociationDirigeant[];
  documents: {
    rna: IDocumentRNA[];
    dac: IDocumentDAC[];
  };
}

export const getAssociationProtected = async (
  maybeSiren: string
): Promise<IAssociationProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseAssociation(
    siren,
    ApplicationRightsToScopes[ApplicationRights.associationProtected]
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: "AssociationProtected",
    })
  );
};
