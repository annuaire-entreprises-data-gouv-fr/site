import routes from "#clients/routes";
import type { IAgentScope } from "#models/authentication/agent/scopes/constants";
import type { ILiensCapitalistiquesProtected } from "#models/espace-agent/liens-capitalistiques";
import type {
  IEtatCivilLiensCapitalistiques,
  IPersonneMoraleLiensCapitalistiques,
} from "#models/rne/types";
import type { UseCase } from "#models/use-cases";
import { formatFirstNames, formatLastName, type Siren } from "#utils/helpers";
import clientAPIEntreprise from "../client";
import type { IAPIEntrepriseLiensCapitalistiques } from "./types";

/**
 * GET liens capitalistiques from API Entreprise
 */
export async function clientApiEntrepriseLiensCapitalistiques(
  siren: Siren,
  scope: IAgentScope | null,
  year?: string,
  useCase?: UseCase
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseLiensCapitalistiques,
    ILiensCapitalistiquesProtected
  >(
    routes.apiEntreprise.dgfip.liensCapitalistiques(siren, year),
    mapToDomainObject,
    { scope, useCase }
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseLiensCapitalistiques
): ILiensCapitalistiquesProtected => ({
  actionnaires: response.data.capital.actionnaires.map((actionnaire) => {
    const {
      type,
      pourcentage,
      nombre_parts,
      personne_physique_attributes,
      personne_morale_attributes,
      adresse,
    } = actionnaire;

    if (type === "personne_morale" && personne_morale_attributes) {
      return {
        siren: personne_morale_attributes.siren,
        denomination: personne_morale_attributes.denomination,
        pourcentage,
        nombre_parts,
        natureJuridique: personne_morale_attributes.forme_juridique,
        pays: adresse.pays,
        role: "",
      } as IPersonneMoraleLiensCapitalistiques;
    }
    const { nom_patronymique_et_prenoms, civilite } =
      personne_physique_attributes!;
    const { mois, annee } = personne_physique_attributes!.date_naissance;

    const { nom, prenoms } = nom_patronymique_et_prenoms.split(" ").reduce(
      (acc: { nom: string; prenoms: string }, motCourant: string) => {
        if (motCourant === motCourant.toUpperCase()) {
          acc.nom += (acc.nom ? " " : "") + motCourant;
        } else {
          acc.prenoms += (acc.prenoms ? " " : "") + motCourant;
        }
        return acc;
      },
      { nom: "", prenoms: "" }
    );

    const { prenom, prenoms: formattedPrenoms } = formatFirstNames(
      prenoms,
      " "
    );

    return {
      pourcentage,
      nombre_parts,
      sexe: civilite,
      nom: formatLastName(nom),
      prenom,
      prenoms: formattedPrenoms,
      role: "",
      nationalite: "",
      dateNaissancePartial: `${mois}-${annee}`,
      pays: adresse.pays,
    } as IEtatCivilLiensCapitalistiques;
  }),
  filiales: response.data.participations.filiales.map(
    (filiale) =>
      ({
        siren: filiale.siren,
        denomination: filiale.denomination,
        pourcentage: filiale.pourcentage_detention,
        natureJuridique: filiale.forme_juridique,
        pays: filiale.adresse.pays,
        role: "",
      }) as IPersonneMoraleLiensCapitalistiques
  ),
});
