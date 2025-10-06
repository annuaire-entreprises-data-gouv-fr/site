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
  "conformite",
  "beneficiaires",
  "agent",
  "pseudo_opendata",
  "effectifs_annuels",
  "chiffre_affaires",
  "travaux_publics",
  "bilans_bdf",
  "administrateur",
  "liasses_fiscales",
  "liens_capitalistiques",
] as const;

export const marchePublicScopes: IAgentScope[] = [
  "liens_capitalistiques",
  "beneficiaires",
  "conformite",
  "travaux_publics",
];

export const aidesPubliquesScopes: IAgentScope[] = [
  "liens_capitalistiques",
  "beneficiaires",
  "conformite",
  "travaux_publics",
];

export const lutteContreLaFraudeScopes: IAgentScope[] = [
  "liens_capitalistiques",
  "beneficiaires",
  "conformite",
  "travaux_publics",
  "bilans_bdf",
  "liasses_fiscales",
];

export const subventionsAssociationsScopes: IAgentScope[] = [];
