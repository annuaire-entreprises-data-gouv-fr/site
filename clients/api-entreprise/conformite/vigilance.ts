import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/conformite';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseConformiteVigilance = IAPIEntrepriseResponse<{
  entity_status: {
    code: 'ok';
    libelle: string;
    description: string;
  };
  date_debut_validite: string;
  date_fin_validite: string;
  code_securite: string;
  document_url: string;
  document_url_expires_in: number;
}>;
/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteVigilance = async (siren: Siren) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseConformiteVigilance,
    IConformite
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.conformite.vigilance(siren)}`,
    mapToDomainObject
  );
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteVigilance) => {
  return {
    url: response.data.document_url,
    isValid: response.data?.entity_status?.code === 'ok',
    label: 'Attestation de vigilance',
  };
};
