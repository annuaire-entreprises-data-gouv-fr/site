import { createServerFn } from "@tanstack/react-start";
import { ApplicationRights } from "#/models/authentication/user/rights";
import { getCollectiviteDVF } from "#/models/collectivite/dvf";
import {
  getCollectiviteEffectifsSalaries,
  getCollectiviteEtablissementsSirene,
  getCollectiviteFluxOuvertureEtablissements,
} from "#/models/collectivite/economie-locale";
import { withApplicationRight } from "../../middlewares";
import {
  getCollectiviteCommuneSchema,
  getCollectiviteEconomieLocaleSchema,
} from "./schemas";

export const getCollectiviteEffectifsSalariesFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getCollectiviteEconomieLocaleSchema)
  .handler(
    async ({ data: { codeInsee } }) =>
      await getCollectiviteEffectifsSalaries(codeInsee)
  );

export const getCollectiviteEtablissementsSireneFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getCollectiviteEconomieLocaleSchema)
  .handler(
    async ({ data: { codeInsee } }) =>
      await getCollectiviteEtablissementsSirene(codeInsee)
  );

export const getCollectiviteFluxOuvertureEtablissementsFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getCollectiviteEconomieLocaleSchema)
  .handler(
    async ({ data: { codeInsee } }) =>
      await getCollectiviteFluxOuvertureEtablissements(codeInsee)
  );

export const getCollectiviteDVFFn = createServerFn()
  .middleware([withApplicationRight(ApplicationRights.opendata)])
  .validator(getCollectiviteCommuneSchema)
  .handler(
    async ({ data: { codeInsee } }) => await getCollectiviteDVF(codeInsee)
  );
