import { inseeClientPost } from '.';
import routes from '../routes';

export const getAvisSituationSiren = async (siren: string, nic: string) => {
  return await inseeClientPost(
    routes.sireneInsee.avis,
    'form.siren=388581290&form.nic=00011'
  );
};
