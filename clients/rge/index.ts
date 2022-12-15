import routes from '#clients/routes';
import {
  IRGECompanyCertifications,
  INomCertificat,
} from '#models/certifications';
import { Siren, Siret } from '#utils/helpers';
import { httpGet } from '#utils/network';

export enum WORKING_WITH_ENUM {
  PROFESSIONAL = 'PROFESSIONAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

interface IRGEResponse {
  results: {
    adresse: string;
    code_postal: string;
    code_qualification: string;
    commune: string;
    domaine: string;
    email: string;
    nom_certificat: INomCertificat;
    nom_entreprise: string;
    nom_qualification: string;
    organisme: string;
    particulier: Boolean;
    siret: Siret;
    site_internet: string;
    telephone: string;
    url_qualification: string;
  }[];
}

/**
 * Reconnu Garant de l'Environnement (RGE)
 * https://france-renov.gouv.fr/annuaire-rge
 */
const clientRGE = async (siren: Siren): Promise<IRGECompanyCertifications> => {
  const route = routes.certifications.rge;
  const response = await httpGet(route, { params: { qs: `siret:${siren}*` } });

  return mapToDomainObject(response.data as IRGEResponse);
};

const mapToDomainObject = (rge: IRGEResponse): IRGECompanyCertifications => {
  if (!rge.results.length) {
    return {
      companyInfo: null,
      certifications: [],
    };
  }

  const [firstResult] = rge.results;

  const {
    adresse,
    code_postal,
    commune,
    nom_entreprise,
    particulier,
    siret,
    telephone,
    site_internet,
    email,
  } = firstResult;

  const companyInfo: IRGECompanyCertifications['companyInfo'] = {
    adresse: `${adresse}, ${code_postal}, ${commune}`,
    email,
    nomEntreprise: nom_entreprise,
    siret: siret,
    siteInternet: site_internet,
    telephone: telephone,
    workingWith: [
      WORKING_WITH_ENUM.PROFESSIONAL,
      ...(particulier ? [WORKING_WITH_ENUM.INDIVIDUAL] : []),
    ],
  };

  const certifications: IRGECompanyCertifications['certifications'] = [];

  rge.results.forEach((result) => {
    const pos = certifications.findIndex(
      (certification) => certification.nomCertificat === result.nom_certificat
    );
    if (pos !== -1) {
      if (result.domaine !== 'Inconnu') {
        certifications[pos].domaines.push(result.domaine);
      }
    } else {
      const {
        code_qualification,
        domaine,
        nom_certificat,
        nom_qualification,
        organisme,
        url_qualification,
      } = result;
      certifications.push({
        codeQualification: code_qualification,
        domaines: [domaine],
        nomCertificat: nom_certificat,
        nomQualification: nom_qualification,
        organisme,
        urlQualification: url_qualification,
      });
    }
  });

  return {
    companyInfo,
    certifications,
  };
};

export { clientRGE };
