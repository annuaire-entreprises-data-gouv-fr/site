import { clientApiEntrepriseConformiteFiscale } from "#clients/api-entreprise/conformite/fiscale";
import { clientApiEntrepriseConformiteMSA } from "#clients/api-entreprise/conformite/msa";
import { clientApiEntrepriseConformiteVigilance } from "#clients/api-entreprise/conformite/vigilance";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#models/authentication/user/rights";
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

export type IConformiteSocialeUniteLegale = {
  vigilance: IConformiteVigilance | IAPINotRespondingError;
  msa: IConformiteMSA | IAPINotRespondingError;
};

export type IConformiteFiscaleUniteLegale = {
  fiscale: IConformiteFiscale | IAPINotRespondingError;
};

const scopeSociale =
  ApplicationRightsToScopes[ApplicationRights.conformiteSociale];
const scopeFiscale =
  ApplicationRightsToScopes[ApplicationRights.conformiteFiscale];

export const getConformiteSocialeEntreprise = async (
  maybeSiret: string,
  params: { useCase?: UseCase }
): Promise<IConformiteSocialeUniteLegale> => {
  const siret = verifySiret(maybeSiret as string);
  const siren = extractSirenFromSiret(siret);

  const [vigilance, msa] = await Promise.all([
    clientApiEntrepriseConformiteVigilance(
      siren,
      scopeSociale,
      params.useCase
    ).catch((error) =>
      handleApiEntrepriseError(error, {
        siren,
        siret,
        apiResource: "ConformiteVigilance",
      })
    ),
    clientApiEntrepriseConformiteMSA(siret, scopeSociale, params.useCase).catch(
      (error) =>
        handleApiEntrepriseError(error, {
          siren,
          siret,
          apiResource: "ConformiteMSA",
        })
    ),
  ]);

  return {
    vigilance,
    msa,
  };
};

export const getConformiteFiscaleEntreprise = async (
  maybeSiret: string,
  params: { useCase?: UseCase }
): Promise<IConformiteFiscaleUniteLegale> => {
  const siret = verifySiret(maybeSiret as string);
  const siren = extractSirenFromSiret(siret);

  const fiscale = await clientApiEntrepriseConformiteFiscale(
    siren,
    scopeFiscale,
    params.useCase
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      siret,
      apiResource: "ConformiteFiscale",
    })
  );

  return {
    fiscale,
  };
};
