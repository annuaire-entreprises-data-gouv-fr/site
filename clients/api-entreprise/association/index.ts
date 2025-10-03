import routes from "#clients/routes";
import type { IAssociationProtected } from "#models/espace-agent/association-protected";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise from "../client";
import type { IAPIEntrepriseAssociation } from "./types";

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseAssociation(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseAssociation,
    IAssociationProtected
  >(routes.apiEntreprise.association(siren), mapToDomainObject);
}

const mapToDomainObject = (
  response: IAPIEntrepriseAssociation
): IAssociationProtected => ({
  documents: {
    rna: response.data.documents_rna,
    dac: response.data.etablissements.flatMap((e) =>
      e.documents_dac.map((d) => ({
        ...d,
        etablissement: {
          siret: e.siret,
          adresse: `${e.adresse.code_postal} ${e.adresse.commune}`,
          siege: e.siege,
        },
      }))
    ),
  },
  dirigeants: response.data.etablissements
    .flatMap((e) =>
      e.representants_legaux.map((d) => ({
        ...d,
        etablissement: {
          siret: e.siret,
          adresse: `${e.adresse.code_postal} ${e.adresse.commune}`,
          siege: e.siege,
        },
      }))
    )
    .sort((d1, _d2) => (d1.etablissement.siege ? -1 : 1)),
});
