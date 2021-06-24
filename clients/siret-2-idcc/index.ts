import { IConventionCollective } from '../../models/convention-collective';
import { httpGet } from '../../utils/network/http';
import routes from '../routes';

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

interface ISiret2idccResponse {
  siret: string;
  conventions?: IConventionObject[];
}

interface IConventionObject {
  active: boolean;
  title: string;
  shortTitle: string;
  url: string;
  num: number;
  etat: 'VIGUEUR' | 'VIGUEUR_ETEN';
  siret?: string;
}

const fetchConventionCollectives = async (
  sirets: string[]
): Promise<IConventionCollective[]> => {
  const batches = generateBatches(sirets);

  const response = (await Promise.all(
    batches.map((urls) => httpGet(urls).then((response) => response.data))
  )) as ISiret2idccResponse[][];

  const flattenedResponse = response.reduce(
    (acc, item) => [...acc, ...item],
    []
  );
  return mapToDomainObject(flattenedResponse);
};

const mapToDomainObject = (
  siret2idccResponses: ISiret2idccResponse[]
): IConventionCollective[] => {
  return siret2idccResponses.reduce((acc: IConventionCollective[], el) => {
    if (!el.conventions) {
      return acc;
    }
    return [
      ...acc,
      ...el.conventions.map((convention) => {
        return {
          siret: el.siret,
          active: convention.active,
          title: convention.title,
          idccNumber: convention.num,
          url: convention.url,
        };
      }),
    ];
  }, []);
};

export default fetchConventionCollectives;
