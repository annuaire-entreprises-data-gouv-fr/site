import routes from '#clients/routes';
import { ICarteProfessionnelleTravauxPublics } from '#models/espace-agent/carte-professionnelle-travaux-publics';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseCarteProfessionnelleTravauxPublics =
  IAPIEntrepriseResponse<{
    document_url: string;
    expires_in: number;
  }>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseCarteProfessionnelleTravauxPublics = async (
  siren: Siren
) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseCarteProfessionnelleTravauxPublics,
    ICarteProfessionnelleTravauxPublics
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.carteProfessionnelleTravauxPublics(siren)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = (
  response: IAPIEntrepriseCarteProfessionnelleTravauxPublics
): ICarteProfessionnelleTravauxPublics => {
  return {
    documentUrl: response.data.document_url,
  };
};
