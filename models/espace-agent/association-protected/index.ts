import { clientApiEntrepriseAssociation } from '#clients/api-entreprise/association';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

type IDocumentAssociation = {
  date_depot: string; //'2019-01-01';
  url: string;
  id: string;
  type: string; //'Budget prévisionnel';
};

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

type IAssociationDirigeant = {
  civilite: string;
  nom: string;
  prenom: string;
  fonction: string;
  valideur_cec: boolean;
  publication_internet: boolean;
  telephone: string;
  courriel: string;
  etablissement: IAssociationEtablissement;
};

export type IAssociationEtablissement = {
  siret: string;
  adresse: string;
  siege: boolean;
};

export type IAssociationProtected = {
  documents: {
    rna: IDocumentRNA[];
    dac: IDocumentDAC[];
  };
  dirigeants: IAssociationDirigeant[];
};

export const getAssociationProtected = async (
  maybeSiren: string
): Promise<IAssociationProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  const response = clientApiEntrepriseAssociation(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'AssociationProtected',
    })
  );

  return response;
};
