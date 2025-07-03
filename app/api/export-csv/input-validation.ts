import { z } from 'zod';

const sirenSiretValidator = z.string().refine(
  (value) => {
    const cleaned = value.replace(/\s/g, '');
    return /^[0-9]{9}$/.test(cleaned) || /^[0-9]{14}$/.test(cleaned);
  },
  { message: 'Must be a valid SIREN (9 digits) or SIRET (14 digits)' }
);

const dateValidator = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

const locationValidator = z
  .array(z.string().regex(/^\d+$/, 'Must contain only digits'))
  .optional();

export const exportCsvSchema = z.object({
  count: z.boolean().optional(),
  activity: z.enum(['active', 'ceased', 'all']).optional(),
  legalUnit: z.enum(['hq', 'all']).optional(),
  headcount: z
    .object({
      min: z.number().min(0).max(999),
      max: z.number().min(0).max(999),
    })
    .optional(),
  categories: z
    .array(z.enum(['PME', 'ETI', 'GE']))
    .max(100)
    .optional(),
  legalCategories: z
    .array(z.string().regex(/^\d{4}$/, 'Must be a 4-digit code'))
    .max(100)
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
  siretsAndSirens: z.array(sirenSiretValidator).max(100).optional(),
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
        .regex(
          /^\d{1,2}\.\d{1,2}[A-Z]$/,
          'Must be a valid NAF code (like 01.12Z)'
        )
    )
    .optional(),
  sap: z
    .array(
      z
        .string()
        .regex(/^[A-Z]$/, 'Must be a valid SAP code (1 uppercase letter)')
    )
    .optional(),
});

export type ExportCsvInput = z.infer<typeof exportCsvSchema>;
