import { clientAssociation } from '#clients/api-proxy/association';
import { tvaNumber } from '#models/tva/utils';
import {
  verifyIdRna,
  verifySiren,
  verifySiret,
  verifyTVANumber,
} from '#utils/helpers';
import { clientAPIInclusion } from './api-inclusion';
import { clientEORI } from './api-proxy/eori';
import { clientUniteLegaleIG } from './api-proxy/greffe';
import { clientTVA } from './api-proxy/tva';
import { clientDocuments } from './api-rne/documents';
import clientSearchRechercheEntreprise from './recherche-entreprise';
import { clientUniteLegaleRechercheEntreprise } from './recherche-entreprise/siren';
import { clientUniteLegaleInsee } from './sirene-insee/siren';

export class APISlugNotFound extends Error {
  constructor(public status: number, public message: string) {
    super();
  }
}

const ping = async (slug: string | string[]) => {
  const sirenGanymede = verifySiren('880878145');
  const siretGanymede = verifySiret('88087814500015');
  const sirenDanone = verifySiren('552032534');
  const sirenInclusion = verifySiren('419437629');

  switch (slug) {
    case 'api-proxy-ig':
      return await clientUniteLegaleIG(sirenDanone);
    case 'api-sirene-insee':
      return await clientUniteLegaleInsee(sirenGanymede, 1, false);
    case 'api-sirene-donnees-ouvertes':
      return await clientUniteLegaleRechercheEntreprise(sirenGanymede, 1);
    case 'api-association':
      return await clientAssociation(verifyIdRna('W551000280'), '');
    case 'api-marche-inclusion':
      return await clientAPIInclusion(sirenInclusion);
    case 'api-tva':
      const tva = verifyTVANumber(tvaNumber(sirenDanone));
      return await clientTVA(tva);
    case 'api-eori':
      return await clientEORI(siretGanymede);
    case 'api-recherche':
      return await clientSearchRechercheEntreprise({
        searchTerms: 'test',
        pageResultatsRecherche: 1,
        searchFilterParams: undefined,
        inclureEtablissements: false,
      });
    case 'api-rne':
      return await clientDocuments(sirenDanone);
    default:
      throw new APISlugNotFound(404, `API ping ${slug} not found`);
  }
};

export const pingAPIClient = async (slug: string | string[]) => {
  try {
    await ping(slug);
    return { test: true, status: 200 };
  } catch (e: any) {
    if (e instanceof APISlugNotFound) {
      throw e;
    } else {
      return { test: false, status: e.status || 500 };
    }
  }
};
