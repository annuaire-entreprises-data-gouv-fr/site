import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import {
  IEtablissementBio,
  IEtablissementsBio,
} from '#models/certifications/bio';
import { Siren, formatAdresse, verifySiret } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IBioResponse, IBioItem } from './interface';

/**
 * BIO
 * https://annuaire.agencebio.org/
 */
export const clientProfessionnelBio = async (
  siren: Siren
): Promise<IEtablissementsBio> => {
  const route = routes.certifications.bio.api;
  // siret actually accept both siren and siret
  const response = await httpGet(route, {
    params: { siret: siren, nb: 1500 },
  });
  const data = response.data as IBioResponse;
  if (!data.items || data.items.length === 0) {
    throw new HttpNotFound(`No certifications found for : ${siren}`);
  }

  const etablissementsBio = mapToDomainObject(data.items);

  if (etablissementsBio.length === 0) {
    throw new HttpNotFound(`No certifications found for : ${siren}`);
  }
  return {
    etablissementsBio,
  };
};

const mapToDomainObject = (bioItems: IBioItem[]): IEtablissementBio[] => {
  return bioItems.reduce((etablissementsBio: IEtablissementBio[], bioItem) => {
    const {
      lieu = '',
      codePostal = '',
      ville = '',
    } = (bioItem?.adressesOperateurs || [])[0] || {};

    const adresse = formatAdresse({
      libelleVoie: lieu,
      libelleCommune: ville,
      codePostal,
    });

    // reset invalide siret
    let siret = '';
    try {
      siret = verifySiret(bioItem.siret || '');
    } catch {}

    const validCertificates = (bioItem.certificats || []).filter(
      (certif) => certif.etatCertification === 'ENGAGEE'
    );

    if (validCertificates.length > 0) {
      const {
        dateArret = '',
        dateEngagement = '',
        dateSuspension = '',
        dateNotification = '',
        url = '',
        organisme = '',
        etatCertification = '',
      } = validCertificates.length > 0 ? validCertificates[0] : {};

      etablissementsBio.push({
        numeroBio: (bioItem.numeroBio || '').toString(),
        enseigne: bioItem.reseau || '',
        denomination:
          bioItem.denominationcourante || bioItem.raisonSociale || '',
        adresse,
        siret,
        websites: bioItem.siteWebs?.map((site) => site.url),
        activities: bioItem.activites?.map((activity) => activity.nom),
        categories: bioItem.categories?.map((category) => category.nom),
        products: bioItem.productions?.map((product) => product.nom),
        onlyBio: bioItem.mixite === 'Non',
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
          exempted: !organisme && !url,
        },
      });
    }
    return etablissementsBio;
  }, []);
};
