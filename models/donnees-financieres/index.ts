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
import { IUniteLegale } from '..';

export interface IDonneesFinancieres {
  uniteLegale: IUniteLegale;
  bilansFinanciers:
    | {
        bilans: IBilanFinancier[];
        hasBilanConsolide: boolean;
        firstYear: string;
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
  year: string;
}

export const getDonneesFinancieresFromSlug = async (
  slug: string
): Promise<IDonneesFinancieres> => {
  const siren = verifySiren(slug);
  const [uniteLegale, bilansFinanciers] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    clientBilansFinanciers(siren).catch((e) => {
      if (e instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.MEF, 404);
      }
      logErrorInSentry('Error in API data financieres', {
        siren,
        details: e.toString(),
      });
      return APINotRespondingFactory(EAdministration.MEF, e.status || 500);
    }),
  ]);

  return {
    uniteLegale,
    bilansFinanciers,
  };
};
