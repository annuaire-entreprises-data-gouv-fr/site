import routes from '#clients/routes';
import { IConformite } from '#models/espace-agent/donnees-restreintes-entreprise';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';

export type IAPIEntrepriseConformiteVigilance = {
  data: {
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
  };
};

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseConformiteVigilance = async (
  siren: Siren,
  recipientSiret?: string
) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseConformiteVigilance,
    IConformite
  >(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.conformite.vigilance}${siren}/attestation_vigilance`,
    mapToDomainObject,
    recipientSiret
  );
};

const mapToDomainObject = (response: IAPIEntrepriseConformiteVigilance) => {
  return {
    url: response.data.document_url,
    isValid: response.data?.entity_status?.code === 'ok',
    label: 'Attestation de vigilance',
  };
};
