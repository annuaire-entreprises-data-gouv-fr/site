import { UniteLegale } from '.';
import logErrorInSentry from '../utils/sentry';
import routes from './routes';

export interface IEtablissementConvention {
  siret: string;
  conventions?: IConventions[];
}

export interface IConventions {
  active: boolean;
  title: string;
  shortTitle: string;
  url: string;
  num: number;
  etat: 'VIGUEUR' | 'VIGUEUR_ETEN';
  siret?: string;
}

/**
 * The Convention Collective API expects a list of SIRET.
 * SIRET is 14 char so 150 sirets makes a >2000char urls that breaks the API.
 *
 * This helper breaks it into as many valid urls as necessary (130 urls batches)
 */
const generateBatches = (sirets: string[]) => {
  const siretBatches = [];
  for (var i = 0; i < sirets.length; i += 130) {
    siretBatches.push(
      `${routes.conventionCollectives}${sirets.slice(i, i + 130).join(',')}`
    );
  }
  return siretBatches;
};

const getConventionCollectives = async (
  unite_legale: UniteLegale
): Promise<IConventions[] | undefined> => {
  try {
    const sirets = unite_legale.etablissements.map((e) => e.siret);

    const batches = generateBatches(sirets);

    const result = (await Promise.all(
      batches.map((urls) => fetch(urls).then((response) => response.json()))
    )) as IEtablissementConvention[][];

    const response = result.reduce((acc, item) => [...acc, ...item], []);

    const flatConventions = response.reduce((acc: IConventions[], el) => {
      if (!el.conventions) {
        return acc;
      }
      return [
        ...acc,
        ...el.conventions.map((convention) => {
          const { active, title, shortTitle, num, url, etat } = convention;
          return { siret: el.siret, active, title, shortTitle, num, url, etat };
        }),
      ];
    }, []);

    return flatConventions;
  } catch (e) {
    const errorMessage = `${unite_legale.siren} error in convention collectives : ${e}`;
    console.log(errorMessage);
    logErrorInSentry(errorMessage);
    return [];
  }
};

export default getConventionCollectives;
