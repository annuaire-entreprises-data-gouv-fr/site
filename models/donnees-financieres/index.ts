import { HttpNotFound } from '#clients/exceptions';
import { IBudgetCollectivite } from '#clients/open-data-soft/agregats-comptable-collectivite';
import { clientBilansFinanciers } from '#clients/open-data-soft/bilans-financiers';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { Siren, verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
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

const getBudgetCollectivite = async (siren: Siren) => {
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
    return {
      ...defaultFinances,
      financesCollectivite: getBudgetCollectivite(siren),
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
