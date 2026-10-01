import { clientApiEntrepriseFondationsRestreintes } from "#/clients/api-entreprise/fondations-restreintes/index.server";
import type { UseCase } from "#/models/use-cases";
import { verifyIdRnf } from "#/utils/helpers/fondations";
import { handleApiEntrepriseError } from "../utils";

export const getFondationsRestreintes = async (
  maybeIdRnf: string,
  { useCase }: { useCase: UseCase }
) => {
  const idRnf = verifyIdRnf(maybeIdRnf);
  return clientApiEntrepriseFondationsRestreintes(idRnf, null, useCase).catch(
    (error) =>
      handleApiEntrepriseError(error, {
        idRnf,
        apiResource: "FondationsRestreintes",
      })
  );
};
