import { clientApiEntrepriseConformiteFiscale } from "#clients/api-entreprise/conformite/fiscale";
import { clientApiEntrepriseConformiteMSA } from "#clients/api-entreprise/conformite/msa";
import { clientApiEntrepriseConformiteVigilance } from "#clients/api-entreprise/conformite/vigilance";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { UseCase } from "#models/use-cases";
import { extractSirenFromSiret, verifySiret } from "#utils/helpers";
import { handleApiEntrepriseError } from "./utils";

type IConformite = {
  url: string | null;
  label: string | null;
};

export type IConformiteFiscale = IConformite & {
  dateDelivrance: string;
};

export type IConformiteVigilance = IConformite & {
  status: "a_jour" | "non_a_jour";
  dateDelivrance: string;
  dateFinValidite: string;
};

export type IConformiteMSA = IConformite & {
  status: "a_jour" | "non_a_jour" | "sous_investigation";
};

export type IConformiteUniteLegale = {
  fiscale: IConformiteFiscale | IAPINotRespondingError;
  vigilance: IConformiteVigilance | IAPINotRespondingError;
  msa: IConformiteMSA | IAPINotRespondingError;
};

export const getConformiteEntreprise = async (
  maybeSiret: string,
  params: { useCase?: UseCase }
): Promise<IConformiteUniteLegale> => {
  const siret = verifySiret(maybeSiret as string);
  const siren = extractSirenFromSiret(siret);

  const [fiscale, vigilance, msa] = await Promise.all([
    clientApiEntrepriseConformiteFiscale(siren, params.useCase).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: "ConformiteFiscale",
      })
    ),
    clientApiEntrepriseConformiteVigilance(siren, params.useCase).catch(
      (error) =>
        handleApiEntrepriseError(error, {
          siren,
          siret,
          apiResource: "ConformiteVigilance",
        })
    ),
    clientApiEntrepriseConformiteMSA(siret, params.useCase).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: "ConformiteMSA",
      })
    ),
  ]);

  return {
    fiscale,
    vigilance,
    msa,
  };
};
