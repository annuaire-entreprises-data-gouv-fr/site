import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import { IEntrepriseInclusive } from '#models/certifications/entreprise-inclusive';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

type APIInclusionResponse = {
  id: number;
  name: string; // 'IDDEE 13';
  brand: string; // 'Elise Méditerranée MARSEILLE IDDEE13';
  slug: string; // 'iddee-13-13';
  siret: string; // '53374499100035';
  nature: string; // 'HEAD_OFFICE';
  kind: string; // 'EI';
  kind_parent: string; // 'Insertion';
  presta_type: string[]; //['PREST', 'BUILD'];
  contact_website: string; // 'https://www.elise.com.fr';
  contact_email: string; // 'elise.mediterranee@elise.com.fr';
  contact_phone: string; // '0484253370';
  contact_social_website: string; // '';
  logo_url: string; // 'https://cellar-c2.services.clever-cloud.com/c4-prod/siae_logo/571f1c19-6bed-4ae3-a4d3-10dc1cd9cd3c.png';
  address: string; // '1 Avenue de la Bauxite';
  city: string; // 'Marseille';
  post_code: string; // '13015';
  department: string; // '13';
  region: string; //"Provence-Alpes-Côte d'Azur";
  is_qpv: boolean; //false;
  is_cocontracting: boolean; // true;
  is_active: boolean; // true;
  sectors: { name: string; slug: string }[];
  networks: { name: string; slug: string }[];
  offers: { name: string; description: string }[];
  client_references: [];
  labels_old: [];
  created_at: string; // '2019-12-05T15:37:56.609000+01:00';
  updated_at: string; // '2023-12-22T09:55:18.027575+01:00';
};

/**
 * API Inclusion
 *
 * https://lemarche.inclusion.beta.gouv.fr/api/docs/
 */
const clientMarcheInclusion = async (
  siren: Siren
): Promise<IEntrepriseInclusive> => {
  const url = routes.certifications.entrepriseInclusive.api + '41943762900043';
  const response = await httpGet<APIInclusionResponse>(url, {
    params: { token: process.env.API_MARCHE_INCLUSION_TOKEN },
  });

  return mapToDomainObject(response);
};

const mapToDomainObject = (res: APIInclusionResponse) => {
  const { slug, siret, kind, kind_parent } = res;
  return {
    marcheInclusionLink: routes.certifications.entrepriseInclusive.site + slug,
    siret,
    type: kind + ' ' + kind_parent,
  };
};

const stubbedClientInclusion = stubClientWithSnapshots({
  clientMarcheInclusion,
});

export { stubbedClientInclusion as clientMarcheInclusion };
