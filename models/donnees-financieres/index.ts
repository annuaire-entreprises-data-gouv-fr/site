import { HttpNotFound } from '#clients/exceptions';
import {
  IBudgetCollectivite,
  clientAgregatsComptableCollectivite,
} from '#clients/open-data-soft/agregats-comptable-collectivite';
import { clientBilansFinanciers } from '#clients/open-data-soft/bilans-financiers';
import routes from '#clients/routes';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale, isCollectiviteTerritoriale } from '..';

export interface IDonneesFinancieres {
  uniteLegale: IUniteLegale;
  bilansFinanciers:
    | {
        bilans: IBilanFinancier[];
        lastModified: string | null;
      }
    | IAPINotRespondingError;
  agregatsComptableCollectivite?:
    | {
        agregatsComptable: IBudgetCollectivite;
        lastModified: string | null;
        year: string;
      }[]
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
  if (isCollectiviteTerritoriale(uniteLegale)) {
    let agregatsComptableCollectivite;
    const years = routes.agregatsComptableCollectivite;
    const { siret } = uniteLegale.siege;
    try {
      agregatsComptableCollectivite = await Promise.all([
        clientAgregatsComptableCollectivite(
          siret,
          years[2019].ods.metadata,
          years[2019].ods.search,
          '2019'
        ),
        clientAgregatsComptableCollectivite(
          siret,
          years[2020].ods.metadata,
          years[2020].ods.search,
          '2020'
        ),
        clientAgregatsComptableCollectivite(
          siret,
          years[2021].ods.metadata,
          years[2021].ods.search,
          '2021'
        ),
      ]);
    } catch (e: any) {
      if (e instanceof HttpNotFound) {
        agregatsComptableCollectivite = APINotRespondingFactory(
          EAdministration.MEF,
          404
        );
      }
      logErrorInSentry('Error in API agregats comptable collectivite', {
        siren,
        details: e.toString(),
      });
      agregatsComptableCollectivite = APINotRespondingFactory(
        EAdministration.MEF,
        e.status || 500
      );
    }
    return {
      uniteLegale,
      bilansFinanciers,
      agregatsComptableCollectivite,
    };
  }

  return {
    uniteLegale,
    bilansFinanciers,
  };
};
