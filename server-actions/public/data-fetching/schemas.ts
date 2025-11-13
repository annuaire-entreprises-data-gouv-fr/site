import { z } from "zod";

export const getEoriValidationSchema = z.object({
  siret: z.string().min(1, "Siret is required"),
});
