import { clientApiEntrepriseConformiteFiscale } from '#clients/api-entreprise/conformite/fiscale';
import { clientApiEntrepriseConformiteMSA } from '#clients/api-entreprise/conformite/msa';
import { clientApiEntrepriseConformiteVigilance } from '#clients/api-entreprise/conformite/vigilance';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import { Siren, Siret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';

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

export const getDonneesRestreintesEntreprise = async (
  siren: Siren,
  siret: Siret
): Promise<IConformiteUniteLegale> => {
  const handleApiEntrepriseError = (e: any) => {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'DonneesRestreintesAPIEntreprise',
        context: {
          siren,
          siret,
        },
        administration: EAdministration.DINUM,
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, e.status || 500);
  };

  const [fiscale, vigilance, msa] = await Promise.all([
    clientApiEntrepriseConformiteFiscale(siren).catch(handleApiEntrepriseError),
    clientApiEntrepriseConformiteVigilance(siren).catch(
      handleApiEntrepriseError
    ),
    clientApiEntrepriseConformiteMSA(siret).catch(handleApiEntrepriseError),
  ]);

  return {
    fiscale,
    vigilance,
    msa,
  };
};
