import inseeDirigeantClient from '.';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { IUserSession } from '../../utils/session/accessSession';
import { HttpServerError, HttpUnauthorizedError } from '../exceptions';
import routes from '../routes';

enum HABILITATION {
  // non-dirigeants
  _00 = '00', // ?
  _10 = '10',
  _20 = '20',
  _30 = '30',
  _31 = '31',

  // dirigeants
  _40 = '40',
  _50 = '50',
  _51 = '51',
  _52 = '52',
}

export const habilitationExplanations = {
  '10': 'aucun dirigeant n’est inscrit au répertoire Sirene pour ce Siren',
  '20': 'vous n’êtes pas dirigeant pour ce Siren',
  '30': 'vous n’êtes plus dirigeant pour ce Siren',
  '31': 'vous n’êtes pas encore dirigeant pour ce Siren',
  '40': 'vous n’avez aucune habilitation',
  '50': 'vous êtes habilitateur principal',
  '51': 'vous n’êtes plus habilitateur principal',
  '52': 'vous n’êtes pas encore habilitateur principal',
} as { [key: string]: string };

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
    throw new HttpServerError(500, `UserSession is undefined`);
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
    throw new HttpUnauthorizedError(401, HABILITATION._20);
  }

  if (
    codeHabilitation === HABILITATION._40 ||
    codeHabilitation === HABILITATION._50 ||
    codeHabilitation === HABILITATION._51 ||
    codeHabilitation === HABILITATION._52
  ) {
    return response;
  }

  throw new HttpUnauthorizedError(401, codeHabilitation);
};
