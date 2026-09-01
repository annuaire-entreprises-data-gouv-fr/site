import z from "zod";
import { FICHE } from "#/components/title-section/tabs";

export const entrepriseFicheSchema = z.enum([
  "entreprise",
  "annonces",
  "dirigeants",
  "divers",
  "documents",
  "donnees-financieres",
  "effectifs",
  "etablissements-scolaires",
  "labels-certificats",
]);
export type EntrepriseFiche = z.infer<typeof entrepriseFicheSchema>;

export const ENTREPRISE_TAB_TO_FICHE: Record<EntrepriseFiche, FICHE> = {
  entreprise: FICHE.INFORMATION,
  annonces: FICHE.ANNONCES,
  dirigeants: FICHE.DIRIGEANTS,
  divers: FICHE.DIVERS,
  documents: FICHE.DOCUMENTS,
  "donnees-financieres": FICHE.FINANCES,
  effectifs: FICHE.EFFECTIFS,
  "etablissements-scolaires": FICHE.ETABLISSEMENTS_SCOLAIRES,
  "labels-certificats": FICHE.CERTIFICATS,
};
