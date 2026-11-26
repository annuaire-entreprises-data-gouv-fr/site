export type IAgentScope = (typeof allAgentScopes)[number];

export const defaultAgentScopes: IAgentScope[] = [
  "agent",
  "nonDiffusible",
  "rne",
  "pseudo_opendata",
];

export const allAgentScopes = [
  "rne",
  "nonDiffusible",
  "conformite_fiscale",
  "conformite_sociale",
  "beneficiaires",
  "agent",
  "pseudo_opendata",
  "effectifs",
  "chiffre_affaires",
  "travaux_publics",
  "bilans_bdf",
  "administrateur",
  "liasses_fiscales",
  "liens_capitalistiques",
  "identite_restreinte_dirigeants",
] as const;

export const marchePublicScopes: IAgentScope[] = [
  "liens_capitalistiques",
  "beneficiaires",
  "conformite_fiscale",
  "conformite_sociale",
  "travaux_publics",
  "identite_restreinte_dirigeants",
];

export const aidesPubliquesScopes: IAgentScope[] = [
  "liens_capitalistiques",
  "beneficiaires",
  "conformite_fiscale",
  "conformite_sociale",
  "travaux_publics",
  "identite_restreinte_dirigeants",
];

export const lutteContreLaFraudeScopes: IAgentScope[] = [
  "liens_capitalistiques",
  "beneficiaires",
  "conformite_sociale",
  "travaux_publics",
  "bilans_bdf",
  "liasses_fiscales",
  "identite_restreinte_dirigeants",
];

export const subventionsAssociationsScopes: IAgentScope[] = [];
