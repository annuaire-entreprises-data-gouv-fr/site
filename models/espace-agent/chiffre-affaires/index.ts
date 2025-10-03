import { clientApiEntrepriseChiffreAffaires } from "#clients/api-entreprise/chiffres-affaires";
import { IAPINotRespondingError } from "#models/api-not-responding";
import { UseCase } from "#models/use-cases";
import { verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export type IChiffreAffairesProtected = {
  chiffreAffaires: number;
  dateFinExercice: string;
  year: number;
}[];

export const getChiffreAffairesProtected = async (
  maybeSiret: string,
  params: { useCase?: UseCase }
): Promise<IChiffreAffairesProtected | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseChiffreAffaires(siret, params.useCase).catch(
    (error) =>
      handleApiEntrepriseError(error, {
        siret,
        apiResource: "ChiffreAffairesProtected",
      })
  );
};
