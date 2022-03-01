import inseeDirigeantClient from '.';
import { Siren, verifySiren } from '../../utils/helpers/siren-and-siret';
import { IUserSession } from '../../utils/session/manageSession';
import routes from '../routes';

const formatQueryParams = (siren: Siren, user: IUserSession) => {
  const date = user.birthdate.split('-');
  const formatedDate = `${date[2]}/${date[1]}/${date[0]}`;

  const params = `?siren=${siren}&nomFamille=${user.family_name}&prenoms=${
    user.given_name
  }&sexe=${
    user.gender === 'female' ? 'F' : 'M'
  }&dateNaissance=${formatedDate}&codePaysNaissance=${
    user.birthcountry
  }&codeCommuneNaissance=${user.birthplace}`;

  return params;
};

export const verifyDirigeant = async (
  slug: string,
  user: IUserSession | null
) => {
  const siren = verifySiren(slug);

  if (!user) {
    return null;
  }
  try {
    const query = formatQueryParams(siren, user);

    const request = await inseeDirigeantClient({
      url: routes.dirigeantInsee.verify + encodeURI(query),
      method: 'GET',
      headers: {
        'X-APIkey': process.env.PROXY_API_KEY || '',
      },
    });

    const response = request.data;
    console.log(response);
  } catch (e) {
    console.log(e);
  }
  return mapToDomainObject();
};

const mapToDomainObject = (): null => {
  return null;
};
