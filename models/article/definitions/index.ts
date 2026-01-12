import type { IArticle } from "../type";

export type IDefinition = {
  administrations: string[];
} & IArticle;

export const getDefinition = (slug: string) =>
  allDefinitions.find((article) => article.slug === slug);

export const allDefinitions = [
  require("../../../data/definitions/annonce-legale.yml") as IDefinition,
  require("../../../data/definitions/association.yml") as IDefinition,
  require("../../../data/definitions/bodacc.yml") as IDefinition,
  require("../../../data/definitions/certification-qualiopi.yml") as IDefinition,
  require("../../../data/definitions/code-ape.yml") as IDefinition,
  require("../../../data/definitions/economie-sociale-et-solidaire-ess.yml") as IDefinition,
  require("../../../data/definitions/entrepreneur-de-spectacles-vivants.yml") as IDefinition,
  require("../../../data/definitions/entreprise-individuelle.yml") as IDefinition,
  require("../../../data/definitions/entreprise-non-diffusible.yml") as IDefinition,
  require("../../../data/definitions/etablissement.yml") as IDefinition,
  require("../../../data/definitions/index-egapro-egalite-professionnelle-entre-les-femmes-et-les-hommes.yml") as IDefinition,
  require("../../../data/definitions/kbis.yml") as IDefinition,
  require("../../../data/definitions/label-professionnel-du-bio.yml") as IDefinition,
  require("../../../data/definitions/numero-nic.yml") as IDefinition,
  require("../../../data/definitions/numero-siren.yml") as IDefinition,
  require("../../../data/definitions/numero-siret.yml") as IDefinition,
  require("../../../data/definitions/personne-morale.yml") as IDefinition,
  require("../../../data/definitions/personne-physique.yml") as IDefinition,
  require("../../../data/definitions/societe-a-mission.yml") as IDefinition,
  require("../../../data/definitions/tva-intracommunautaire.yml") as IDefinition,
];
