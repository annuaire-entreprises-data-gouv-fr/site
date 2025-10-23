import {
  defaultAgentScopes,
  type IAgentScope,
} from "../agent/scopes/constants";
import type { IRolesDataGroup } from "../group/groups";
import { getIAgentScope } from "./helpers";
import type { ISession } from "./session";

/**
 * Application scopes designate specific parts or section of the UI / app
 */
export enum ApplicationRights {
  opendata = "Données en open data",
  isAgent = "Compte agent public",
  nonDiffusible = "Données des entreprises non diffusibles",
  actesRne = "Actes au RNE",
  bilansRne = "Bilans au RNE",
  documentsRne = "Documents au RNE",
  protectedCertificats = "Certificats Qualifelec, Qualibat et OPQIBI",
  associationProtected = "Actes, statuts et données des dirigeants des associations",
  mandatairesRCS = "État civil complet des dirigeants d’entreprise",
  beneficiaires = "Registre des Bénéficiaires Effectifs",
  conformite = "Attestations de conformité fiscale (DGFiP) et sociale (Urssaf & MSA)",
  subventionsAssociation = "Données des subventions des associations",
  effectifsAnnuels = "Effectifs annuels (RCD)",
  bilansBDF = "Accès aux bilans (Banque de France)",
  chiffreAffaires = "Accès aux chiffres d’affaires (DGFiP)",
  liensCapitalistiques = "Accès aux liens capitalistiques (DGFiP)",
  travauxPublics = "Accès aux données relatives aux travaux publics",
  administrateur = "Administrateur",
  liassesFiscales = "Accès aux liasses fiscales (DGFiP)",
}

export const ApplicationRightsToScopes: Record<
  ApplicationRights,
  IAgentScope | null
> = {
  [ApplicationRights.opendata]: null,
  [ApplicationRights.actesRne]: "rne",
  [ApplicationRights.bilansRne]: "rne",
  [ApplicationRights.documentsRne]: "rne",
  [ApplicationRights.bilansBDF]: "bilans_bdf",
  [ApplicationRights.conformite]: "conformite",
  [ApplicationRights.chiffreAffaires]: "chiffre_affaires",
  [ApplicationRights.liassesFiscales]: "liasses_fiscales",
  [ApplicationRights.liensCapitalistiques]: "liens_capitalistiques",
  [ApplicationRights.effectifsAnnuels]: "effectifs_annuels",
  [ApplicationRights.protectedCertificats]: "pseudo_opendata",
  [ApplicationRights.mandatairesRCS]: "pseudo_opendata",
  [ApplicationRights.subventionsAssociation]: "pseudo_opendata",
  [ApplicationRights.associationProtected]: "pseudo_opendata",
  [ApplicationRights.beneficiaires]: "beneficiaires",
  [ApplicationRights.nonDiffusible]: "nonDiffusible",
  [ApplicationRights.isAgent]: "agent",
  [ApplicationRights.travauxPublics]: "travaux_publics",
  [ApplicationRights.administrateur]: "administrateur",
};

/**
 * Does the user have the right to access a view
 */
export function hasRights(session: ISession | null, right: ApplicationRights) {
  const userScopes = getIAgentScope(session);

  if (!ApplicationRightsToScopes[right]) {
    return true;
  }

  return userScopes.includes(ApplicationRightsToScopes[right]);
}

/**
 * Get all the groups granting a specific right to the user
 */
export function getGroupsGrantingRights(
  userGroups: IRolesDataGroup[],
  right: ApplicationRights
) {
  const requiredScope = ApplicationRightsToScopes[right];

  if (!requiredScope || defaultAgentScopes.includes(requiredScope)) {
    return [];
  }

  return userGroups.filter((group) => group.scopes.includes(requiredScope));
}

export function isLoggedIn(session: ISession | null) {
  return getIAgentScope(session).length > 0;
}
