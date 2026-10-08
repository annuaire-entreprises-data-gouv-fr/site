import {
  clientCollectiviteEffectifsSalaries,
  clientCollectiviteEtablissementsSirene,
  clientCollectiviteFluxOuvertureEtablissements,
} from "#/clients/collectivite-economie-locale";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";

interface ICollectiviteEconomieLocaleMetadata {
  lastModified: string;
  source: string;
}

export interface ICollectiviteEffectifSalarie {
  effectif: number;
  grandSecteurActivite: string;
}

export interface ICollectiviteEtablissementSirene {
  lat: number | null;
  lon: number | null;
  nom: string;
  siret: string;
}

export interface ICollectiviteFluxEtablissementsMensuel {
  fermetures: number;
  mois: string;
  ouvertures: number;
}

export interface ICollectiviteEffectifsSalaries
  extends ICollectiviteEconomieLocaleMetadata {
  effectifsSalaries: Record<string, ICollectiviteEffectifSalarie[]>;
}

export interface ICollectiviteEtablissementsSirene
  extends ICollectiviteEconomieLocaleMetadata {
  etablissements: ICollectiviteEtablissementSirene[];
}

export interface ICollectiviteFluxOuvertureEtablissements
  extends ICollectiviteEconomieLocaleMetadata {
  fluxEtablissements: ICollectiviteFluxEtablissementsMensuel[];
}

function handleEconomieLocaleError(
  error: unknown,
  codeInsee: string,
  administration: EAdministration,
  ressource: string
): IAPINotRespondingError {
  if (error instanceof HttpNotFound) {
    return APINotRespondingFactory(administration, 404);
  }

  logErrorInSentry(
    new FetchRessourceException({
      administration,
      cause: error,
      context: { codeInsee },
      ressource,
    })
  );

  return APINotRespondingFactory(administration, 500);
}

export const getCollectiviteEffectifsSalaries = async (
  codeInsee: string
): Promise<ICollectiviteEffectifsSalaries | IAPINotRespondingError> => {
  try {
    return await clientCollectiviteEffectifsSalaries(codeInsee);
  } catch (error) {
    return handleEconomieLocaleError(
      error,
      codeInsee,
      EAdministration.URSSAF,
      "CollectiviteEffectifsSalaries"
    );
  }
};

export const getCollectiviteEtablissementsSirene = async (
  codeInsee: string
): Promise<ICollectiviteEtablissementsSirene | IAPINotRespondingError> => {
  try {
    return await clientCollectiviteEtablissementsSirene(codeInsee);
  } catch (error) {
    return handleEconomieLocaleError(
      error,
      codeInsee,
      EAdministration.INSEE,
      "CollectiviteEtablissementsSirene"
    );
  }
};

export const getCollectiviteFluxOuvertureEtablissements = async (
  codeInsee: string
): Promise<
  ICollectiviteFluxOuvertureEtablissements | IAPINotRespondingError
> => {
  try {
    return await clientCollectiviteFluxOuvertureEtablissements(codeInsee);
  } catch (error) {
    return handleEconomieLocaleError(
      error,
      codeInsee,
      EAdministration.INSEE,
      "CollectiviteFluxOuvertureEtablissements"
    );
  }
};
