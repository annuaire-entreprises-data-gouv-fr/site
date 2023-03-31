import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import {
  IEtablissementBio,
  IEtablissementsBio,
} from '#models/certifications/bio';
import { Siren, formatAdresse, verifySiret } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IBioResponse } from './interface';

/**
 * BIO
 * https://annuaire.agencebio.org/
 */
export const clientProfessionnelBio = async (
  siren: Siren
): Promise<IEtablissementsBio> => {
  const route = routes.certifications.bio.api;
  // siret actually accept both siren and siret
  const response = await httpGet(route, { params: { siret: siren, nb: 100 } });
  const data = response.data as IBioResponse;
  if (!data.items || data.items.length === 0) {
    throw new HttpNotFound(`No certifications found for : ${siren}`);
  }

  return { etablissementsBio: data.items.map(mapToDomainObject) };
};

const mapToDomainObject = (
  bio: IBioResponse['items'][0]
): IEtablissementBio => {
  const {
    lieu = '',
    codePostal = '',
    ville = '',
  } = (bio?.adressesOperateurs || [])[0] || {};
  const adresse = formatAdresse({
    libelleVoie: lieu,
    libelleCommune: ville,
    codePostal,
  });

  // reset invalide siret
  let siret = '';
  try {
    siret = verifySiret(bio.siret || '');
  } catch {}

  const {
    dateArret = '',
    dateEngagement = '',
    dateSuspension = '',
    dateNotification = '',
    url = '',
    organisme = '',
    etatCertification = '',
  } = (bio.certificats || []).length > 0 ? bio.certificats[0] : {};

  return {
    numeroBio: (bio.numeroBio || '').toString(),
    enseigne: bio.reseau || '',
    denomination: bio.denominationcourante || bio.raisonSociale || '',
    adresse,
    siret,
    websites: bio.siteWebs?.map((site) => site.url),
    activities: bio.activites?.map((activity) => activity.nom),
    categories: bio.categories?.map((category) => category.nom),
    products: bio.productions?.map((product) => product.nom),
    onlyBio: bio.mixite === 'Non',
    certificat: {
      date: {
        end: dateArret,
        start: dateEngagement,
        suspension: dateSuspension,
        notification: dateNotification,
      },
      url,
      organization: organisme,
      status: etatCertification,
    },
  };
};
