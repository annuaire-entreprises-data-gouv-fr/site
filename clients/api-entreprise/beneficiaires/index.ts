import routes from "#clients/routes";
import type { IBeneficiairesEffectif } from "#models/espace-agent/beneficiaires";
import type { UseCase } from "#models/use-cases";
import { formatNameFull, type Siren } from "#utils/helpers";
import clientAPIEntreprise, { type IAPIEntrepriseResponse } from "../client";

export type IAPIEntrepriseBeneficiaires = IAPIEntrepriseResponse<
  Array<
    IAPIEntrepriseResponse<{
      beneficiaire_uuid: string;
      nom: string;
      nom_usage: string;
      prenoms: string[];
      date_naissance: {
        annee: string;
        mois: string;
      };
      nationalite: string;
      pays_residence: string;
      modalites: IBeneficiairesEffectif["modalites"];
    }>
  >
>;

/**
 * GET beneficiaires effectfs from API Entreprise
 */
export const clientApiEntrepriseBeneficiaires = async (
  siren: Siren,
  useCase?: UseCase
) =>
  await clientAPIEntreprise<
    IAPIEntrepriseBeneficiaires,
    Array<IBeneficiairesEffectif>
  >(routes.apiEntreprise.beneficiaires(siren), mapToDomainObject, { useCase });

const mapToDomainObject = (
  response: IAPIEntrepriseBeneficiaires
): Array<IBeneficiairesEffectif> =>
  response.data.map(({ data: beneficiaire }) => ({
    nom: formatNameFull(beneficiaire.nom, beneficiaire.nom_usage),
    prenoms: (beneficiaire.prenoms || "").join(", "),
    nationalite: beneficiaire.nationalite,
    moisNaissance: beneficiaire.date_naissance.mois,
    anneeNaissance: beneficiaire.date_naissance.annee,
    paysResidence: beneficiaire.pays_residence,
    modalites: beneficiaire.modalites,
  }));
