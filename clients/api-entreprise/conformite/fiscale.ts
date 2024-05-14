import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/conformite';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseConformiteFiscale = IAPIEntrepriseResponse<{
  document_url: string;
  document_url_expires_in: number;
  date_delivrance_attestation: string;
  date_periode_analysee: string;
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteFiscale = async (
  siren: Siren,
  recipientSiret?: string
) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseConformiteFiscale,
    IConformite
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.conformite.fiscale.replace('{siren}', siren)}`,
    mapToDomainObject,
    recipientSiret
  );
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteFiscale) => {
  return {
    url: response.data.document_url,
    isValid: true,
    label: 'Attestation fiscale',
  };
};
