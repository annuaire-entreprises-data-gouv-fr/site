import { clientApiEntrepriseConformiteFiscale } from '#clients/api-entreprise/conformite/fiscale';
import { clientApiEntrepriseConformiteMSA } from '#clients/api-entreprise/conformite/msa';
import { clientApiEntrepriseConformiteVigilance } from '#clients/api-entreprise/conformite/vigilance';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { Siren, Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export type IConformite = {
  isValid: boolean | null;
  url: string | null;
  label: string | null;
};

export type IConformiteUniteLegale = {
  fiscale: IConformite | IAPINotRespondingError;
  vigilance: IConformite | IAPINotRespondingError;
  msa: IConformite | IAPINotRespondingError;
};

export const getConformiteEntreprise = async (
  siren: Siren,
  siret: Siret,
  recipientSiret?: string
): Promise<IConformiteUniteLegale> => {
  await new Promise((resolve) => setTimeout(resolve, 20000));

  const [fiscale, vigilance, msa] = await Promise.all([
    clientApiEntrepriseConformiteFiscale(siren, recipientSiret).catch((error) =>
      handleApiEntrepriseError(error, { siren, siret })
    ),
    clientApiEntrepriseConformiteVigilance(siren, recipientSiret).catch(
      (error) => handleApiEntrepriseError(error, { siren, siret })
    ),
    clientApiEntrepriseConformiteMSA(siret, recipientSiret).catch((error) =>
      handleApiEntrepriseError(error, { siren, siret })
    ),
  ]);

  return {
    fiscale,
    vigilance,
    msa,
  };
};
