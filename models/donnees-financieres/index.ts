import { HttpNotFound } from '#clients/exceptions';
import { clientBilansFinanciers } from '#clients/open-data-soft/bilans-financiers-societe';
import {
  IBudgetCollectivite,
  clientBudgetCollectivite,
} from '#clients/open-data-soft/budget-collectivite';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { Siren, Siret, verifySiren } from '#utils/helpers';
import logErrorInSentry, { logWarningInSentry } from '#utils/sentry';
import {
  IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isServicePublic,
} from '..';

export interface IFinances {
  uniteLegale: IUniteLegale;
  financesSociete:
    | {
        bilans: IBilanFinancier[];
        hasBilanConsolide: boolean;
        lastModified: string | null;
      }
    | IAPINotRespondingError;
  financesAssociation: IBilanFinancierAssociation[] | IAPINotRespondingError;
  financesCollectivite?:
    | {
        agregatsComptable: IBudgetCollectivite;
        lastModified: string | null;
        year: string;
      }[]
    | IAPINotRespondingError;
}

export type IBilanFinancierAssociation = {
  dons: number;
  subv: number;
  produits: number;
  charges: number;
  resultat: number;
  year: number;
};

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

const getBudgetCollectivite = async (siret: Siret) => {
  try {
    const datasets = [
      { slug: 'agregatspl-2017', year: 2017 },
      {
        slug: 'agregats-comptables-des-collectivites-et-des-etablissements-publics-locaux-2018',
        year: 2018,
      },
      {
        slug: 'agregats-comptables-des-collectivites-et-des-etablissements-publics-locaux-2019',
        year: 2019,
      },
      {
        slug: 'agregats-comptables-des-collectivites-et-des-etablissements-publics-locaux-2019-',
        year: 2020,
      },
      {
        slug: 'agregats-comptables-des-collectivites-et-des-etablissements-publics-locaux-2021',
        year: 2021,
      },
    ];

    if (new Date().getFullYear() > datasets[datasets.length - 1].year + 1) {
      logWarningInSentry('Error in donnees financieres collectivites', {
        details: 'Need to add previous year dataset',
      });
    }

    return await Promise.all(
      datasets.map(({ slug, year }) =>
        clientBudgetCollectivite(siret, slug, year).catch((err) => {
          if (err instanceof HttpNotFound) {
            return null;
          }
          throw err;
        })
      )
    );
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MEF, 404);
    }
    logErrorInSentry('Error in donnees financieres collectivites', {
      siret,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MEF, e.status || 500);
  }
};

const getFinancesSociete = async (siren: Siren) => {
  return await clientBilansFinanciers(siren).catch((e) => {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MEF, 404);
    }
    logErrorInSentry('Error in API data financieres', {
      siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MEF, e.status || 500);
  });
};

export const getFinancesFromSlug = async (slug: string): Promise<IFinances> => {
  const siren = verifySiren(slug);
  const uniteLegale = await getUniteLegaleFromSlug(siren);

  const defaultFinances = {
    uniteLegale,
    financesSociete: APINotRespondingFactory(EAdministration.MEF, 404),
    financesAssociation: APINotRespondingFactory(EAdministration.MI, 404),
    financesCollectivite: APINotRespondingFactory(EAdministration.MEF, 404),
  } as IFinances;

  if (isAssociation(uniteLegale)) {
    return {
      ...defaultFinances,
      financesAssociation:
        uniteLegale.association.data?.bilans ||
        APINotRespondingFactory(EAdministration.MI, 404),
    };
  }

  if (isCollectiviteTerritoriale(uniteLegale)) {
    const financesCollectivite = await getBudgetCollectivite(
      uniteLegale.siege.siret
    );
    return {
      ...defaultFinances,
      financesCollectivite,
    };
  }

  if (
    isServicePublic(uniteLegale) ||
    uniteLegale.complements.estEntrepreneurIndividuel
  ) {
    return defaultFinances;
  }

  return {
    ...defaultFinances,
    financesSociete: await getFinancesSociete(siren),
  };
};
