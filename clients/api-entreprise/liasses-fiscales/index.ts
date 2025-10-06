import routes from "#clients/routes";
import type { ILiassesFiscalesProtected } from "#models/espace-agent/dgfip/liasses-fiscales";
import type { UseCase } from "#models/use-cases";
import type { Siren } from "#utils/helpers";
import clientAPIEntreprise from "../client";
import type { IAPIEntrepriseLiassesFiscales } from "./types";

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseDgfipLiassesFiscales(
  siren: Siren,
  year?: string,
  useCase?: UseCase
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseLiassesFiscales,
    ILiassesFiscalesProtected
  >(
    routes.apiEntreprise.dgfip.liassesFiscales(siren, year),
    mapToDomainObject,
    { useCase }
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseLiassesFiscales
): ILiassesFiscalesProtected => ({
  obligationsFiscales: response.data.obligations_fiscales.map(
    (obl) => `Régime: ${obl.regime}${obl.libelle ? ` (${obl.libelle})` : ""}`
  ),
  declarations: response.data.declarations.map((declaration) => ({
    imprime: declaration.numero_imprime,
    regime: declaration.regime,
    dureeExercice: declaration.duree_exercice,
    dateFinExercice: declaration.date_fin_exercice,
    donnees: declaration.donnees.map((donnee) => ({
      intitule: donnee.intitule,
      valeurs: donnee.valeurs,
    })),
  })),
});
