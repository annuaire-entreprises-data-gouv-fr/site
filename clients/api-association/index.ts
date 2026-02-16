import { XMLParser } from "fast-xml-parser";
import { HttpNotFound, HttpUnauthorizedError } from "#clients/exceptions";
import routes from "#clients/routes";
import type { IDataAssociation } from "#models/association/types";
import constants from "#models/constants";
import { formatAdresse, type IdRna, type Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";
import type {
  IAssociationPartenairesResponse,
  IAssociationResponse,
} from "./types";

/**
 * Wrapper client to call API Association (public API)
 *
 * Takes either a RNA or Siren, but Siren seems to work much better
 * @param rnaOrSiren
 * @param siretSiege
 * @returns IDataAssociation
 */
export async function clientAPIAssociationPublic(
  rnaOrSiren: IdRna | Siren,
  siretSiege: string,
  signal?: AbortSignal
) {
  if (!process.env.API_ASSOCIATION_URL) {
    throw new HttpUnauthorizedError("Missing API Association URL");
  }

  const url = `${process.env.API_ASSOCIATION_URL}${routes.apiAssociation.association(encodeURIComponent(rnaOrSiren))}`;

  const response = await httpGet<IAssociationResponse>(url, {
    timeout: constants.timeout.XXL,
    signal,
  });

  return mapToDomainObject(response, siretSiege);
}

/**
 * Wrapper client to call API Association Partenaires (private API)
 *
 * Takes either a RNA or Siren, but Siren seems to work much better
 * @param rnaOrSiren
 * @param siretSiege
 * @returns IDataAssociation
 */
export async function clientAPIAssociationPrivate(
  rnaOrSiren: IdRna | Siren,
  siretSiege: string,
  signal?: AbortSignal
) {
  if (!process.env.API_ASSOCIATION_URL || !process.env.API_ASSOCIATION_KEY) {
    throw new HttpUnauthorizedError("Missing API Association credentials");
  }

  const url = `${process.env.API_ASSOCIATION_URL}${routes.apiAssociation.associationPartenaires(encodeURIComponent(rnaOrSiren))}`;

  const response = await httpGet<string>(url, {
    headers: {
      "X-Gravitee-Api-Key": process.env.API_ASSOCIATION_KEY,
    },
    timeout: constants.timeout.XXL,
    signal,
  });

  return mapToDomainObject(mapPrivateToPublicResponse(response), siretSiege);
}

const mapToArray = <T>(obj: T | T[] | undefined): T[] => {
  if (Array.isArray(obj)) {
    return obj;
  }
  return obj ? [obj] : [];
};

const mapPrivateToPublicResponse = (response: string): IAssociationResponse => {
  const parser = new XMLParser();
  const jsonResponse = parser.parse(
    response
  ) as IAssociationPartenairesResponse;

  if (!jsonResponse.asso) {
    throw new HttpNotFound("Association not found");
  }

  return {
    ...jsonResponse.asso,
    etablissement: mapToArray(jsonResponse.asso.etablissements?.etablissement),
    agrement: mapToArray(jsonResponse.asso.agrements?.agrement),
    compte: mapToArray(jsonResponse.asso.comptes?.compte),
  };
};

const mapToDomainObject = (
  association: IAssociationResponse,
  siretSiege: string
): IDataAssociation => {
  const { agrement = [] } = association;
  const { objet = "", lib_famille1 = "" } = association.activites || {};
  const {
    id_rna,
    nom = "",
    id_ex = "",
    lib_forme_juridique = "",
    date_pub_jo = "",
    date_creat = "",
    date_dissolution = "",
    eligibilite_cec = false,
    regime = "",
    util_publique = false,
    impots_commerciaux,
  } = association.identite || {};

  const {
    num_voie = "",
    type_voie = "",
    cp = "",
    commune = "",
    voie = "",
  } = association?.coordonnees?.adresse_siege || {};

  const {
    commune: communeGestion = "",
    cp: cpGestion = "",
    pays: paysGestion = "",
    voie: voieGestion = "",
  } = association?.coordonnees?.adresse_gestion || {};
  const { site_web = "" } = association?.coordonnees || {};

  const protocol = (site_web || "").indexOf("http") === 0 ? "" : "https://";
  const siteWeb = site_web ? `${protocol}${site_web}` : "";

  return {
    exId: id_ex,
    idAssociation: id_rna,
    nomComplet: nom,
    objet,
    libelleFamille: lib_famille1,
    siteWeb,
    agrement: agrement.map((agr) => ({
      ...agr,
      dateAttribution: agr.date_attribution,
    })),
    formeJuridique: lib_forme_juridique,
    utilPublique: util_publique,
    regime,
    datePublicationJournalOfficiel: date_pub_jo,
    dateCreation: date_creat,
    dateDissolution: date_dissolution,
    eligibiliteCEC: eligibilite_cec,
    impotCommerciaux: impots_commerciaux,
    adresseSiege: formatAdresse({
      numeroVoie: num_voie,
      typeVoie: type_voie,
      libelleVoie: voie,
      codePostal: cp,
      libelleCommune: commune,
    }),
    adresseGestion: formatAdresse({
      libelleVoie: voieGestion,
      codePostal: cpGestion,
      libellePaysEtranger: paysGestion,
      libelleCommune: communeGestion,
    }),
    adresseInconsistency: false,
    bilans: (association.compte || [])
      // id_siret type can be a number !
      .filter((c) => c.annee > 0 && c.id_siret == siretSiege)
      .map(
        ({
          dons = 0,
          subv = 0,
          produits = 0,
          charges = 0,
          resultat = 0,
          annee,
        }) => ({
          charges,
          resultat,
          subv,
          dons,
          produits,
          year: annee,
        })
      )
      .sort((c, b) => c.year - b.year),
  };
};
