import routes from '#clients/routes';
import { IImmatriculationEORI } from '#models/espace-agent/immatriculation-eori';
import { Siret } from '#utils/helpers';
import clientAPIEntreprise, { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseImmatriculationEORI = IAPIEntrepriseResponse<{
  id: string; // FR16002307300010
  actif: boolean; // true
  code_pays: string; // FR
  code_postal: string; // 95520
  libelle: string; // CENTRE INFORMATIQUE DOUANIER
  pays: string; // FRANCE
  rue: string; // 27 R DES BEAUX SOLEILS
  ville: string; // OSNY
}>;

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseImmatriculationEORI = async (
  siret: Siret,
  recipientSiret: Siret | undefined
) => {
  return await clientAPIEntreprise<
    IAPIEntrepriseImmatriculationEORI,
    IImmatriculationEORI
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.immatriculationEORI.replace('{siret}', siret)}`,
    mapToDomainObject,
    recipientSiret
  );
};

const mapToDomainObject = (
  response: IAPIEntrepriseImmatriculationEORI
): IImmatriculationEORI => {
  return {
    identifiantEORI: response.data.id,
    actif: response.data.actif,
    codePays: response.data.code_pays,
  };
};
