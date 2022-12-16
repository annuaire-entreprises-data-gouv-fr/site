import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import {
  IRGECompanyCertifications,
  INomCertificat,
} from '#models/certifications';
import { Siren, Siret } from '#utils/helpers';
import { httpGet } from '#utils/network';

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
    particulier: boolean;
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

  const data = response.data as IRGEResponse;

  if (!data.results.length) {
    throw new HttpNotFound(
      `Cannot found certifications associate to siren : ${siren}`
    );
  }
  return mapToDomainObject(response.data);
};

const mapToDomainObject = (rge: IRGEResponse): IRGECompanyCertifications => {
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
    workingWithIndividual: particulier,
  };

  const certifications: IRGECompanyCertifications['certifications'] = [];

  rge.results.forEach((result) => {
    const findCertification = certifications.findIndex(
      (certification) => certification.nomCertificat === result.nom_certificat
    );
    if (findCertification !== -1) {
      if (result.domaine !== 'Inconnu') {
        certifications[findCertification].domaines.push(result.domaine);
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
