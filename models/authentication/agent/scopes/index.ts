export type IAgentScope = (typeof allAgentScopes)[number];

export const defaultAgentScopes: IAgentScope[] = [
  'agent',
  'nonDiffusible',
  'rne',
  'pseudo_opendata',
];

export const allAgentScopes = [
  'rne',
  'nonDiffusible',
  'conformite',
  'beneficiaires',
  'agent',
  'pseudo_opendata',
  'effectifs_annuels',
  'chiffre_affaires',
  'travaux_publics',
  'bilans',
  'administrateur',
  'liasses_fiscales',
] as const;
