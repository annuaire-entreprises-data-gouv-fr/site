import { createServerFn } from "@tanstack/react-start";
import { getCollectiviteDVF } from "#/models/collectivite/dvf";
import {
  getCollectiviteEffectifsSalaries,
  getCollectiviteEtablissementsSirene,
  getCollectiviteFluxOuvertureEtablissements,
} from "#/models/collectivite/economie-locale";
import { publicMiddlewares } from "../../middlewares";
import {
  getCollectiviteCommuneSchema,
  getCollectiviteEconomieLocaleSchema,
} from "./schemas";

export const getCollectiviteEffectifsSalariesFn = createServerFn()
  .middleware(publicMiddlewares)
  .validator(getCollectiviteEconomieLocaleSchema)
  .handler(
    async ({ data: { codeInsee } }) =>
      await getCollectiviteEffectifsSalaries(codeInsee)
  );

export const getCollectiviteEtablissementsSireneFn = createServerFn()
  .middleware(publicMiddlewares)
  .validator(getCollectiviteEconomieLocaleSchema)
  .handler(
    async ({ data: { codeInsee } }) =>
      await getCollectiviteEtablissementsSirene(codeInsee)
  );

export const getCollectiviteFluxOuvertureEtablissementsFn = createServerFn()
  .middleware(publicMiddlewares)
  .validator(getCollectiviteEconomieLocaleSchema)
  .handler(
    async ({ data: { codeInsee } }) =>
      await getCollectiviteFluxOuvertureEtablissements(codeInsee)
  );

export const getCollectiviteDVFFn = createServerFn()
  .middleware(publicMiddlewares)
  .validator(getCollectiviteCommuneSchema)
  .handler(
    async ({ data: { codeInsee } }) => await getCollectiviteDVF(codeInsee)
  );
