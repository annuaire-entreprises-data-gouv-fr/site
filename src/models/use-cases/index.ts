export const UseCase = {
  autre: "Autre cas d'usage",
  aidesPubliques: "Aides publiques",
  subventionsFonctionnementAssociation:
    "Subventions de fonctionnement aux associations",
  marches: "Marchés publics",
  fraude: "Détection de la fraude",
} as const;
export type UseCase = (typeof UseCase)[keyof typeof UseCase];
