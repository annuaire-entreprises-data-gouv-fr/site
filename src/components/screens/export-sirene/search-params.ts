import { z } from "zod";
import {
  dateValidator,
  exportCsvSchema,
} from "#/clients/sirene-insee/input-validation";

/**
 * Export filters persisted in the URL query parameters, so that users can
 * bookmark or share a search.
 *
 * Every field falls back to its default value when the URL contains an
 * invalid value, so a malformed URL never breaks the page.
 *
 * SIRET/SIREN lists are not included as they can contain up to 500 entries,
 * which would exceed URL length limits.
 */

const defaultHeadcount = { min: 0, max: 14 };

const defaultInclusion = {
  inclure: true,
  inclureNo: true,
  inclureNonRenseigne: true,
};

const headcountBoundValidator = z.number().int().min(0).max(14);

const inclusionValidator = z
  .object({
    inclure: z.boolean(),
    inclureNo: z.boolean(),
    inclureNonRenseigne: z.boolean(),
  })
  .default(defaultInclusion)
  .catch(defaultInclusion);

const dateRangeValidator = z
  .object({
    from: dateValidator.optional().catch(undefined),
    to: dateValidator.optional().catch(undefined),
  })
  .default({})
  .catch({});

const stringListValidator = z.array(z.string()).default([]).catch([]);

export const exportSireneSearchSchema = z.object({
  headcount: z
    .object({ min: headcountBoundValidator, max: headcountBoundValidator })
    .default(defaultHeadcount)
    .catch(defaultHeadcount),
  headcountEnabled: z.boolean().default(false).catch(false),
  categories: z
    .array(z.enum(["PME", "ETI", "GE"]))
    .default([])
    .catch([]),
  activity: z
    .enum(["active", "ceased", "all"])
    .default("active")
    .catch("active"),
  legalUnit: z.enum(["hq", "all"]).default("all").catch("all"),
  locations: z
    .array(
      z.object({
        type: z.enum(["cp", "dep", "reg", "insee"]),
        value: z.string(),
        label: z.string(),
      })
    )
    .default([])
    .catch([]),
  creationDate: dateRangeValidator,
  updateDate: dateRangeValidator,
  legalCategoriesNiveau1: stringListValidator,
  legalCategoriesNiveau2: stringListValidator,
  legalCategoriesNiveau3: stringListValidator,
  ess: inclusionValidator,
  mission: inclusionValidator,
  naf: exportCsvSchema.shape.naf.catch(undefined),
  sap: exportCsvSchema.shape.sap.catch(undefined),
});

export type ExportSireneSearch = z.infer<typeof exportSireneSearchSchema>;

export const defaultExportSireneSearch: ExportSireneSearch =
  exportSireneSearchSchema.parse({});
