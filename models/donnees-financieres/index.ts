import { HttpNotFound } from '#clients/exceptions';
import { clientBilansFinanciers } from '#clients/open-data-soft/bilans-financiers';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale, isAssociation } from '..';

export interface IFinances {
  uniteLegale: IUniteLegale;
  financesSociete:
    | {
        bilans: IBilanFinancier[];
        hasBilanConsolide: boolean;
        lastModified: string | null;
      }
    | IAPINotRespondingError;
  financesAssociation:
    | {
        bilans: IBilanFinancier[];
        hasBilanConsolide: boolean;
        lastModified: string | null;
      }
    | IAPINotRespondingError;
}

export interface IBilanFinancier {
  ratioDeVetuste: number;
  rotationDesStocksJours: number;
  margeEbe: number;
  resultatCourantAvantImpotsSurCa: number;
  couvertureDesInterets: number;
  poidsBfrExploitationSurCaJours: number;
  creditClientsJours: number;
  chiffreDAffaires: number;
  cafSurCa: number;
  ebitda: number;
  dateClotureExercice: string;
  ebit: number;
  ebe: number;
  margeBrute: number;
  resultatNet: number;
  siren: string;
  poidsBfrExploitationSurCa: number;
  autonomieFinanciere: number;
  capaciteDeRemboursement: number;
  ratioDeLiquidite: number;
  tauxDEndettement: number;
  type: string;
  estSimplifie: boolean;
  estConsolide: boolean;
  estComplet: boolean;
  year: number;
}

export const getFinancesFromSlug = async (slug: string): Promise<IFinances> => {
  const siren = verifySiren(slug);
  const uniteLegale = await getUniteLegaleFromSlug(siren);

  if (isAssociation(uniteLegale)) {
    return {
      uniteLegale,
      financesSociete: APINotRespondingFactory(EAdministration.MEF, 404),
      financesAssociation: APINotRespondingFactory(EAdministration.MEF, 404),
    };
  }

  const financesSociete = await clientBilansFinanciers(siren).catch((e) => {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MEF, 404);
    }
    logErrorInSentry('Error in API data financieres', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MEF, e.status || 500);
  });

  return {
    uniteLegale,
    financesSociete,
    financesAssociation: APINotRespondingFactory(EAdministration.MI, 404),
  };
};
