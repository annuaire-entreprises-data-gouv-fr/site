import { clientDVF } from "#/clients/dvf";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";

export interface IDVFIndicateurMensuel {
  mois: string;
  nombreVentesAppartements: number | null;
  nombreVentesLogements: number | null;
  nombreVentesMaisons: number | null;
  prixMedianM2Appartements: number | null;
  prixMedianM2LocauxIndustrielsCommerciaux: number | null;
  prixMedianM2Logements: number | null;
  prixMedianM2Maisons: number | null;
}

export interface ICollectiviteDVF {
  codeInsee: string;
  indicateurs: IDVFIndicateurMensuel[];
  nomCommune: string;
  sirenEpci: string | null;
}

export const getCollectiviteDVF = async (
  codeInsee: string
): Promise<ICollectiviteDVF | IAPINotRespondingError> => {
  try {
    const dvf = await clientDVF(codeInsee);

    if (dvf.indicateurs.length === 0) {
      return APINotRespondingFactory(EAdministration.DGFIP, 404);
    }

    return dvf;
  } catch (error) {
    if (error instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DGFIP, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        administration: EAdministration.DGFIP,
        cause: error,
        context: { codeInsee },
        ressource: "CollectiviteDVF",
      })
    );

    return APINotRespondingFactory(EAdministration.DGFIP, 500);
  }
};
