import inseeDirigeantClient from '.';
import { Siren, verifySiren } from '../../utils/helpers/siren-and-siret';
import logErrorInSentry from '../../utils/sentry';
import { IUserSession } from '../../utils/session/accessSession';
import { HttpUnauthorizedError } from '../exceptions';
import routes from '../routes';

enum HABILITATION {
  // non-dirigeants
  _00 = '00', // ?
  _10 = '10', // Aucun dirigeant n’est inscrit au répertoire Sirene pour cette unité légale Siren'
  _20 = '20', // La personne n’est pas dirigeant pour le Siren
  _30 = '30', // La personne n’est plus dirigeant pour le Siren
  _31 = '31', // La personne n’est pas encore dirigeant pour le Siren

  // dirigeants
  _40 = '40', // La personne n’a aucune habilitation
  _50 = '50', // La personne est habilitateur principal
  _51 = '51', // La personne n’est plus habilitateur principal
  _52 = '52', // La personne n’est pas encore habilitateur principal
}
interface IInseeDirigeantResponse {
  id: number;
  siren?: string;
  identite?: {
    nomFamille: string;
    nomUsage: string;
    prenoms: string;
  };
  contact?: {
    courriel: string;
  };
  dirigeant?: {
    dateDebut: string;
    dateFin: string;
  };
  habilitation?: {
    dateDebut: string;
    dateFin: string;
  };
  etatHabilitation: {
    code: HABILITATION;
    libelle: string;
    message: string;
  };
}

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

/**
 * Return Insee dirigeant response, only if user is dirigeant
 * @param siren
 * @param user
 * @returns
 */
export const verifyDirigeant = async (
  siren: Siren,
  user: IUserSession | null
) => {
  if (!user) {
    throw new HttpUnauthorizedError(
      401,
      `Not a dirigeant: UserSession is undefined`
    );
  }

  const query = formatQueryParams(siren, user);
  const request = await inseeDirigeantClient({
    url: routes.dirigeantInsee.verify + encodeURI(query),
    method: 'GET',
    headers: {
      'X-APIkey': process.env.PROXY_API_KEY || '',
    },
  });

  const response = request.data as IInseeDirigeantResponse;

  const codeHabilitation =
    response.etatHabilitation && response.etatHabilitation.code;

  if (!codeHabilitation) {
    throw new HttpUnauthorizedError(
      401,
      `Not a dirigeant: no habilitation code`
    );
  }

  if (
    codeHabilitation === HABILITATION._40 ||
    codeHabilitation === HABILITATION._50 ||
    codeHabilitation === HABILITATION._51 ||
    codeHabilitation === HABILITATION._52
  ) {
    return response;
  }

  throw new HttpUnauthorizedError(
    401,
    `Not a dirigeant: habilitation code ${codeHabilitation}`
  );
};
