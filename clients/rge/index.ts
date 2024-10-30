import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import { INomCertificat, IRGECertification } from '#models/certifications/rge';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export const certificatsLogo = {
  qualibat: 'qualibat.jpg',
  qualifelec: 'qualifelec.jpg',
  qualipac: 'qualiPAC.jpg',
  qualibois: 'qualiBois.jpg',
  opqibi: 'opqibi.jpg',
  'chauffage +': 'chauffage.jpg',
  qualipv: 'qualiPV.jpg',
  ventilation: 'ventillation.jpg',
  qualisol: 'qualisol.jpg',
  certibat: 'certibat.jpg',
  habitat: 'NF.jpg',
  qualiforage: 'aualiForage.jpg',
};

const getLogoSlug = (nomCertificat: string) => {
  for (let keyToMatch of Object.keys(certificatsLogo)) {
    if ((nomCertificat || '').toLowerCase().indexOf(keyToMatch) !== -1) {
      //@ts-ignore
      return certificatsLogo[keyToMatch] || '';
    }
  }
};

type IRGEResponse = {
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
    siret: string;
    site_internet: string;
    telephone: string;
    url_qualification: string;
  }[];
};

/**
 * Reconnu Garant de l'Environnement (RGE)
 * https://france-renov.gouv.fr/annuaire-rge
 */
const clientRGE = async (siren: Siren): Promise<IRGECertification> => {
  const route = routes.certifications.rge.api;
  const data = await httpGet<IRGEResponse>(route, {
    params: { qs: `siret:${siren}*` },
  });

  if (!data.results.length) {
    throw new HttpNotFound(
      `Cannot found certifications associate to siren : ${siren}`
    );
  }
  return mapToDomainObject(data);
};

const mapToDomainObject = (rge: IRGEResponse) => {
  const [firstResult] = rge.results;

  const {
    adresse = '',
    code_postal = '',
    commune = '',
    nom_entreprise = '',
    particulier = false,
    siret,
    telephone = '',
    site_internet = '',
    email = '',
  } = firstResult;

  const companyInfo = {
    adresse: `${adresse}, ${code_postal}, ${commune}`,
    email,
    nomEntreprise: nom_entreprise,
    siret: siret,
    siteInternet: site_internet,
    telephone: telephone,
    workingWithIndividual: particulier,
  };

  const certifications: IRGECertification['certifications'] = [];

  rge.results.forEach((result) => {
    const findCertification = certifications.findIndex(
      (certification) => certification.nomCertificat === result.nom_certificat
    );
    if (findCertification !== -1) {
      if (result.domaine !== 'Inconnu') {
        const domaines = new Set(certifications[findCertification].domaines);
        domaines.add(result.domaine);
        certifications[findCertification].domaines = Array.from(domaines);
      }
    } else {
      const {
        code_qualification = '',
        domaine = '',
        nom_certificat,
        nom_qualification = '',
        organisme = '',
        url_qualification = '',
      } = result;
      certifications.push({
        logoSlug: getLogoSlug(nom_certificat),
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

const stubbedClientRGE = stubClientWithSnapshots({ clientRGE });
export { stubbedClientRGE as clientRGE };
