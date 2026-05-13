import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { searchWithoutProtectedSiren } from "#/models/search";
import SearchFilterParams from "#/models/search/search-filter-params";
import {
  extractSirenOrSiretFromRechercherUrl,
  isLikelyASiren,
  isLikelyASiret,
} from "#/utils/helpers";
import { queryString } from "#/utils/query";

export function beforeLoadCheckTerme(searchTerm: string | undefined) {
  if (!searchTerm) {
    return;
  }

  const sirenOrSiretParam = extractSirenOrSiretFromRechercherUrl(searchTerm);

  if (isLikelyASiret(sirenOrSiretParam)) {
    throw redirect({
      to: "/etablissement/$slug",
      params: { slug: sirenOrSiretParam },
      search: {
        redirected: "1",
      },
    });
  }
  if (isLikelyASiren(sirenOrSiretParam)) {
    throw redirect({
      to: "/entreprise/$slug",
      params: { slug: sirenOrSiretParam },
      search: {
        redirected: "1",
      },
    });
  }
}

export const searchDefaultParams = {
  terme: "",
  page: 1,
  cp_dep: "",
  cp_dep_label: "",
  cp_dep_type: "",
  dmax: "",
  dmin: "",
  etat: "",
  fn: "",
  label: "",
  n: "",
  naf: "",
  nature_juridique: "",
  tranche_effectif_salarie: "",
  categorie_entreprise: "",
  sap: "",
  type: "",
  ca_min: null,
  ca_max: null,
  res_min: null,
  res_max: null,
};

export const searchQueryParamsSchema = z.object({
  terme: queryString.catch(""),
  page: z.number().min(1).catch(1),
  cp_dep: queryString.catch(""),
  cp_dep_label: queryString.catch(""),
  cp_dep_type: queryString.catch(""),
  dmax: queryString.catch(""),
  dmin: queryString.catch(""),
  etat: queryString.catch(""),
  fn: queryString.catch(""),
  label: queryString.catch(""),
  n: queryString.catch(""),
  naf: queryString.catch(""),
  nature_juridique: queryString.catch(""),
  tranche_effectif_salarie: queryString.catch(""),
  categorie_entreprise: queryString.catch(""),
  sap: queryString.catch(""),
  type: queryString.catch(""),
  ca_min: z.number().nullable().catch(null),
  ca_max: z.number().nullable().catch(null),
  res_min: z.number().nullable().catch(null),
  res_max: z.number().nullable().catch(null),
});

export const searchFn = createServerFn()
  .inputValidator(searchQueryParamsSchema)
  .handler(async ({ data }) => {
    const searchFilterParams = new SearchFilterParams(data);

    const searchResults = await searchWithoutProtectedSiren(
      data.terme,
      data.page,
      searchFilterParams
    );

    return {
      searchResults,
      searchFilterParamsJSON: searchFilterParams.toJSON(),
      searchTerm: data.terme,
    };
  });

export const searchLoaderDeps = ({
  search,
}: {
  search: z.infer<typeof searchQueryParamsSchema>;
}) => ({
  terme: search.terme,
  page: search.page,
  cp_dep: search.cp_dep,
  cp_dep_label: search.cp_dep_label,
  cp_dep_type: search.cp_dep_type,
  dmax: search.dmax,
  dmin: search.dmin,
  etat: search.etat,
  fn: search.fn,
  label: search.label,
  n: search.n,
  naf: search.naf,
  nature_juridique: search.nature_juridique,
  tranche_effectif_salarie: search.tranche_effectif_salarie,
  categorie_entreprise: search.categorie_entreprise,
  sap: search.sap,
  type: search.type,
  ca_min: search.ca_min,
  ca_max: search.ca_max,
  res_min: search.res_min,
  res_max: search.res_max,
});
