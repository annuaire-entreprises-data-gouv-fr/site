import routes from "#clients/routes";
import { ILiassesFiscalesProtected } from "#models/espace-agent/dgfip/liasses-fiscales";
import { UseCase } from "#models/use-cases";
import { Siren } from "#utils/helpers";
import clientAPIEntreprise from "../client";
import { IAPIEntrepriseLiassesFiscales } from "./types";

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
): ILiassesFiscalesProtected => {
  return {
    obligationsFiscales: response.data.obligations_fiscales.map((obl) => {
      return `Régime: ${obl.regime}${obl.libelle ? ` (${obl.libelle})` : ""}`;
    }),
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
  };
};
