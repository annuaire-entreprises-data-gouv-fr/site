import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

/**
 * API Inclusion
 *
 * https://lemarche.inclusion.beta.gouv.fr/api/docs/
 */
export const clientAPIInclusion = async (siren: Siren) => {
  const url = routes.certifications.entrepriseInclusive.api.getBySiren(siren);
  const response = await httpGet<APIInclusionResponse[]>(url, {
    params: { token: process.env.API_MARCHE_INCLUSION_TOKEN },
  });

  if (response.length === 0) {
    throw new HttpNotFound('No result in API Inclusion');
  }
  return await Promise.all(response.map(mapToDomainObject));
};

const mapToDomainObject = async (res: APIInclusionResponse) => {
  const { slug, siret, kind, city, department } = res;
  return {
    marcheInclusionLink: routes.certifications.entrepriseInclusive.site + slug,
    siret: siret || '',
    kind,
    city,
    department,
  };
};
