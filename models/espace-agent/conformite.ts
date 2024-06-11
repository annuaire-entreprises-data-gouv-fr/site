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
  siret: Siret
): Promise<IConformiteUniteLegale> => {
  const [fiscale, vigilance, msa] = await Promise.all([
    clientApiEntrepriseConformiteFiscale(siren).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: 'ConformiteFiscale',
      })
    ),
    clientApiEntrepriseConformiteVigilance(siren).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: 'ConformiteVigilance',
      })
    ),
    clientApiEntrepriseConformiteMSA(siret).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: 'ConformiteMSA',
      })
    ),
  ]);

  return {
    fiscale,
    vigilance,
    msa,
  };
};
