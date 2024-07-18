import routes from '#clients/routes';
import { IAssociationProtected } from '#models/espace-agent/association-protected';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseAssociation } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseAssociation(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseAssociation,
    IAssociationProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.association.replace('{siren}', siren)}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseAssociation
): IAssociationProtected => {
  return {
    documents: {
      rna: response.data.documents_rna,
      dac: response.data.etablissements.flatMap((e) => {
        return e.documents_dac.map((d) => {
          return { ...d, siret: e.siret };
        });
      }),
    },
    dirigeants: response.data.etablissements.flatMap((e) => {
      return e.representants_legaux.map((d) => {
        return { ...d, siret: e.siret };
      });
    }),
  };
};
