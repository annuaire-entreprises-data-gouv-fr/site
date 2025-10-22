import { z } from "zod";

const sirenSiretValidator = z.string().refine(
  (value) => {
    const cleaned = value.replace(/\s/g, "");
    return /^[0-9]{9}$/.test(cleaned) || /^[0-9]{14}$/.test(cleaned);
  },
  {
    message:
      "Le fichier ne doit contenir que des SIREN (9 chiffres) ou SIRET (14 chiffres) valides",
  }
);

const dateValidator = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format YYYY-MM-DD");

const locationValidator = z
  .array(
    z.string().regex(/^\d+$/, "Le champ doit contenir uniquement des chiffres")
  )
  .optional();

export const exportCsvSchema = z.object({
  count: z.boolean().optional(),
  activity: z.enum(["active", "ceased", "all"]).optional(),
  legalUnit: z.enum(["hq", "all"]).optional(),
  headcount: z
    .object({
      min: z.number().min(0).max(999),
      max: z.number().min(0).max(999),
    })
    .optional(),
  categories: z
    .array(z.enum(["PME", "ETI", "GE"]))
    .max(100)
    .optional(),
  legalCategories: z
    .array(
      z
        .string()
        .regex(
          /^(\d{4}|\d{2}\*|\d\*)$/,
          'La catégorie légale doit être un code à 4 chiffres, 2 chiffres suivis de "* ou 1 chiffre suivi de "*"'
        )
    )
    .max(100, "Un maximum de 100 catégories légales peuvent être sélectionnées")
    .optional(),
  creationDate: z
    .object({
      from: dateValidator.optional(),
      to: dateValidator.optional(),
    })
    .optional(),
  updateDate: z
    .object({
      from: dateValidator.optional(),
      to: dateValidator.optional(),
    })
    .optional(),
  siretsAndSirens: z
    .array(sirenSiretValidator)
    .max(100, "Le fichier ne doit pas contenir plus de 500 SIREN et SIRET")
    .optional(),
  ess: z
    .object({
      inclure: z.boolean(),
      inclureNo: z.boolean(),
      inclureNonRenseigne: z.boolean(),
    })
    .optional(),
  mission: z
    .object({
      inclure: z.boolean(),
      inclureNo: z.boolean(),
      inclureNonRenseigne: z.boolean(),
    })
    .optional(),
  location: z
    .object({
      codesPostaux: locationValidator,
      codesInsee: locationValidator,
      departments: locationValidator,
      regions: locationValidator,
    })
    .optional(),
  naf: z
    .array(
      z
        .string()
        .regex(/^\d{1,2}\.\d{1,2}[A-Z]$/, "Code NAF invalide (ex: 01.12Z)")
    )
    .max(100, "Un maximum de 100 codes NAF peuvent être sélectionnés")
    .optional(),
  sap: z
    .array(z.string().regex(/^[A-Z]$/, "Code SAP invalide (ex: A)"))
    .max(100, "Un maximum de 100 codes SAP peuvent être sélectionnés")
    .optional(),
});

export type ExportCsvInput = z.infer<typeof exportCsvSchema>;
