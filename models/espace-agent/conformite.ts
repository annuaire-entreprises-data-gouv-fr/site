import { clientApiEntrepriseConformiteFiscale } from '#clients/api-entreprise/conformite/fiscale';
import { clientApiEntrepriseConformiteMSA } from '#clients/api-entreprise/conformite/msa';
import { clientApiEntrepriseConformiteVigilance } from '#clients/api-entreprise/conformite/vigilance';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { UseCase } from '#models/use-cases';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
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
  maybeSiret: string,
  params: { useCase?: UseCase }
): Promise<IConformiteUniteLegale> => {
  const siret = verifySiret(maybeSiret as string);
  const siren = extractSirenFromSiret(siret);

  const [fiscale, vigilance, msa] = await Promise.all([
    clientApiEntrepriseConformiteFiscale(siren, params.useCase).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: 'ConformiteFiscale',
      })
    ),
    clientApiEntrepriseConformiteVigilance(siren, params.useCase).catch(
      (error) =>
        handleApiEntrepriseError(error, {
          siren,
          siret,
          apiResource: 'ConformiteVigilance',
        })
    ),
    clientApiEntrepriseConformiteMSA(siret, params.useCase).catch((error) =>
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
