import { NotAnIdRnfError } from "#/models/core/fondations.types";

const ID_RNF_REGEX = /^\d{3}-(FE|FDD|FRUP|FA|FCS|FH|FP|FU)-\d{5}-\d{2}$/;

export const isIdRnf = (slug: string): boolean => ID_RNF_REGEX.test(slug);

export const verifyIdRnf = (slug: string): string => {
  if (!isIdRnf(slug)) {
    throw new NotAnIdRnfError(slug);
  }
  return slug;
};

export const getFoundationTypeLabel = (type: string): string => {
  switch (type) {
    case "FDD":
      return "Fond de dotation";
    case "FE":
      return "Fondation d'entreprise";
    case "FA":
      return "Fondation abritée";
    case "FRUP":
      return "Fondation reconnue d’utilité publique";
    case "FCS":
    case "FH":
    case "FP":
    case "FU":
      return `Fondation scientifique (${type})`;
    default:
      return type;
  }
};
export const getFoundationTypeColor = (type: string): string => {
  switch (type) {
    case "FDD":
      return "#d4c254";
    case "FE":
      return "#adbffc";
    case "FA":
      return "#009099";
    case "FRUP":
      return "#faa18d";
    default:
      return "#e08e73";
  }
};
