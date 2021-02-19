import fetchConventionCollectives from '../clients/siret-2-idcc';
import logErrorInSentry from '../utils/sentry';
import { UniteLegale } from './unite-legale';

export interface IConventionCollective {
  title: string;
  url: string;
  idccNumber: number;
  siret: string;
}

const getConventionCollectives = async (
  uniteLegale: UniteLegale
): Promise<IConventionCollective[] | undefined> => {
  try {
    const sirets = uniteLegale.etablissements.map((e) => e.siret);
    return await fetchConventionCollectives(sirets);
  } catch (e) {
    const errorMessage = `${uniteLegale.siren} error in API Siret2Idcc convention collectives : ${e}`;
    console.log(errorMessage);
    logErrorInSentry(errorMessage);
    return [];
  }
};

export default getConventionCollectives;
