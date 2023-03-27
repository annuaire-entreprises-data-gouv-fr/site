import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IBioCompany } from '#models/certifications/bio';
import { Siret } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IBioResponse } from './interface';

/**
 * BIO
 * https://annuaire.agencebio.org/
 */
export const clientProfessionnelBio = async (
  siret: Siret
): Promise<IBioCompany> => {
  const route = routes.certifications.bio.api;
  const response = await httpGet(route, { params: { siret } });
  const data = response.data as IBioResponse;
  if (!data.items || !data.items.length) {
    throw new HttpNotFound(
      `Cannot found certifications associate to siret : ${siret}`
    );
  }

  const item = data.items[0];

  return mapToDomainObject(item);
};

const mapToDomainObject = (bio: IBioResponse['items'][0]): IBioCompany => {
  return {
    numeroBio: (bio.numeroBio || '').toString(),
    businessPhone: bio.telephoneCommerciale,
    email: bio.email || '',
    websites: bio.siteWebs?.map((site) => site.url),
    activities: bio.activites?.map((activity) => activity.nom),
    categories: bio.categories?.map((category) => category.nom),
    products: bio.productions?.map((product) => product.nom),
    onlyBio: bio.mixite === 'Non',
    certifications: bio.certificats.map((certification) => ({
      date: {
        end: certification.dateArret || '',
        start: certification.dateEngagement || '',
        suspension: certification.dateSuspension || '',
        notification: certification.dateNotification || '',
      },
      url: certification.url || '',
      organization: certification.organisme || '',
      status: certification.etatCertification || '',
    })),
  };
};
