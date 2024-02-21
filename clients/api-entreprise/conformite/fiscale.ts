import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/donnees-restreintes-entreprise';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';

export type IAPIEntrepriseConformiteFiscale = {
  data: {
    document_url: string;
    document_url_expires_in: number;
    date_delivrance_attestation: string;
    date_periode_analysee: string;
  };
  links: {};
  meta: {};
};

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteFiscale = async (
  siren: Siren,
  recipientSiret: string
) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseConformiteFiscale,
    IConformite
  >(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.fiscale}${siren}/attestation_fiscale`,
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
