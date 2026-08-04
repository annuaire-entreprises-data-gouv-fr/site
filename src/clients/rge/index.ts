import { HttpNotFound } from "#/clients/exceptions";
import routes from "#/clients/routes";
import type {
  INomCertificat,
  IRGECertification,
} from "#/models/certifications/rge";
import type { Siren } from "#/utils/helpers";
import { httpGet } from "#/utils/network";
import { getCertificatLogoPath } from "../../utils/helpers/certifications/certificats-logo";

export interface IRGEResponse {
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
}

/**
 * Reconnu Garant de l'Environnement (RGE)
 * https://france-renov.gouv.fr/annuaire-rge
 */
export const clientRGE = async (siren: Siren): Promise<IRGECertification> => {
  const route = routes.certifications.rge.api;
  const data = await httpGet<IRGEResponse>(route, {
    params: { qs: `siret:${siren}*`, size: 500 },
  });

  if (!data.results.length) {
    throw new HttpNotFound(
      `Cannot found certifications associate to siren : ${siren}`
    );
  }
  return mapToDomainObject(data);
};

export const mapToDomainObject = (rge: IRGEResponse): IRGECertification => {
  const etablissements = new Map<
    string,
    IRGECertification["etablissements"][number]
  >();

  for (const result of rge.results) {
    let etablissement = etablissements.get(result.siret);

    if (!etablissement) {
      const {
        adresse = "",
        code_postal = "",
        commune = "",
        email = "",
        nom_entreprise = "",
        particulier = false,
        site_internet = "",
        siret,
        telephone = "",
      } = result;

      etablissement = {
        certifications: [],
        companyInfo: {
          adresse: `${adresse}, ${code_postal}, ${commune}`,
          email,
          nomEntreprise: nom_entreprise,
          siret,
          siteInternet: site_internet,
          telephone,
          workingWithIndividual: particulier,
        },
      };
      etablissements.set(siret, etablissement);
    }

    const findCertification = etablissement.certifications.findIndex(
      (certification) => certification.nomCertificat === result.nom_certificat
    );
    if (findCertification === -1) {
      const {
        code_qualification = "",
        domaine = "",
        nom_certificat,
        nom_qualification = "",
        organisme = "",
        url_qualification = "",
      } = result;
      etablissement.certifications.push({
        logoPath: getCertificatLogoPath(nom_certificat),
        codeQualification: code_qualification,
        domaines: [domaine],
        nomCertificat: nom_certificat,
        nomQualification: nom_qualification,
        organisme,
        urlQualification: url_qualification,
      });
    } else if (result.domaine !== "Inconnu") {
      const domaines = new Set(
        etablissement.certifications[findCertification].domaines
      );
      domaines.add(result.domaine);
      etablissement.certifications[findCertification].domaines =
        Array.from(domaines);
    }
  }

  return {
    etablissements: Array.from(etablissements.values()),
  };
};
