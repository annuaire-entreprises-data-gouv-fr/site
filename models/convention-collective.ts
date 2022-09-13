import { IUniteLegale } from '.';
import fetchConventionCollectives from '../clients/siret-2-idcc';
import logErrorInSentry from '../utils/sentry';
import { EAdministration } from './administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import { getUniteLegaleFromSlug } from './unite-legale';

export interface IConventionCollective {
  title: string;
  url: string;
  idccNumber: number;
  siret: string;
}

export interface IConventions {
  uniteLegale: IUniteLegale;
  conventionCollectives: IConventionCollective[] | IAPINotRespondingError;
}

const getConventionCollectivesFromSlug = async (
  slug: string
): Promise<IConventions> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug, {});
  const conventionCollectives = await getConventionCollectives(uniteLegale);
  return { uniteLegale, conventionCollectives };
};

const getConventionCollectives = async (
  uniteLegale: IUniteLegale
): Promise<IConventionCollective[] | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.estDiffusible) {
      return [];
    }
    const sirets = uniteLegale.etablissements.all.map((e) => e.siret);
    return await fetchConventionCollectives(sirets);
  } catch (e: any) {
    logErrorInSentry('Error in API convention collectives', {
      siren: uniteLegale.siren,
      details: `Error : ${e}`,
    });
    return APINotRespondingFactory(EAdministration.METI, 500);
  }
};

export default getConventionCollectivesFromSlug;
