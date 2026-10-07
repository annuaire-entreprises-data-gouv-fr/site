import routes from "#/clients/routes";
import { httpGet } from "#/utils/network";
import type {
  IEffectifsSalariesResponse,
  IEtablissementsSireneResponse,
  IFluxOuvertureEtablissementsResponse,
} from "./types";

export const clientCollectiviteEffectifsSalaries = async (
  codeInsee: string
): Promise<IEffectifsSalariesResponse> =>
  await httpGet<IEffectifsSalariesResponse>(
    routes.economieLocale.effectifsSalaries(codeInsee)
  );

export const clientCollectiviteEtablissementsSirene = async (
  codeInsee: string
): Promise<IEtablissementsSireneResponse> =>
  await httpGet<IEtablissementsSireneResponse>(
    routes.economieLocale.etablissementsSirene(codeInsee)
  );

export const clientCollectiviteFluxOuvertureEtablissements = async (
  codeInsee: string
): Promise<IFluxOuvertureEtablissementsResponse> =>
  await httpGet<IFluxOuvertureEtablissementsResponse>(
    routes.economieLocale.fluxOuvertureEtablissements(codeInsee)
  );
