import type { IProConnectUserInfo } from "#clients/authentication/pro-connect/strategy";
import { Scopes } from "#models/authentication/agent/scopes";
import {
  NeedASiretException,
  PrestataireException,
} from "#models/authentication/authentication-exceptions";
import { getAgentGroups } from "#models/authentication/group";
import { isSiret, verifySiret } from "#utils/helpers";
import { AgentOrganisation } from "../organisation";
import { defaultAgentScopes, type IAgentScope } from "../scopes/constants";

export class AgentConnected {
  private domain;
  private idpId;
  private email;
  private familyName;
  private firstName;
  private proConnectSub;
  private siret;

  constructor(userInfo: IProConnectUserInfo) {
    this.domain = this.extractDomain(userInfo?.email || "");
    this.idpId = userInfo.idp_id ?? "";
    this.email = userInfo.email ?? "";
    this.familyName = userInfo.family_name ?? "";
    this.firstName = userInfo.given_name ?? "";
    this.proConnectSub = userInfo.sub;

    const siretAsString = (userInfo.siret || "").replaceAll(" ", "");

    if (!siretAsString || !isSiret(siretAsString)) {
      throw new NeedASiretException(
        "The user doesn‘t have a siret",
        `${this.domain} - ${this.idpId}`
      );
    }

    this.siret = verifySiret(siretAsString);
  }

  extractDomain(email: string) {
    try {
      return (email.match(/@(.*)/) || [""]).shift() || "";
    } catch {
      return "";
    }
  }

  isLikelyPrestataire = () => {
    for (const bannedDomain of [
      "i-carre.net",
      "beta.gouv.fr",
      "code.gouv.fr",
      "data.gouv.fr",
      "demarches-simplifiees.fr",
      "entreprise.api.gouv.fr",
      "franceconnect.gouv.fr",
      "monstagedetroisieme.fr",
      "scn.rie.gouv.fr",
    ]) {
      if (this.domain.indexOf(bannedDomain) > -1) {
        return true;
      }
    }

    if (
      this.email.match(
        /[.@-]*(ext|external|externe|presta|prestataire|consultant)(s)*[.@-]/g
      )
    ) {
      return true;
    }

    return false;
  };

  /**
   * Habilitation is either agent-level or organisation-level
   * @returns
   */
  async getHabilitationLevel() {
    const agentHabilitation = await this.getAgentHabilitation();
    if (agentHabilitation) {
      return agentHabilitation;
    }

    if (this.isLikelyPrestataire()) {
      // this exclude prestataires and stop connexion workflow
      throw new PrestataireException(`${this.email} is a prestataire`);
    }
    // if no individuals rights, user inherit from orga rights
    return await this.getOrganisationHabilitation();
  }

  async getAgentHabilitation() {
    const superAgentScopes = new Scopes();
    const groupsScopes: Record<string, IAgentScope[]> = {};

    const groups = await getAgentGroups({ allowProConnectRedirection: false });

    groups.forEach((agentGroup) => {
      const groupsNewScopes = agentGroup.scopes.filter(
        (scope) => !superAgentScopes.hasScope(scope)
      );

      if (groupsNewScopes.length > 0) {
        groupsScopes[agentGroup.organisation_siret] = groupsNewScopes;
      }

      superAgentScopes.add(agentGroup.scopes);
    });

    if (superAgentScopes.hasScopes()) {
      return {
        scopes: [
          ...new Set([...defaultAgentScopes, ...superAgentScopes.scopes]),
        ],
        groupsScopes,
        userType: "Super-agent connecté",
        isSuperAgent: true,
      };
    }

    return null;
  }

  async getOrganisationHabilitation() {
    const organisation = new AgentOrganisation(this.siret);
    return await organisation.getHabilitationLevel();
  }

  /**
   * Verify agent rights and extract all required agent informations
   * @returns
   */
  async getAndVerifyAgentInfo() {
    const habilitationLevel = await this.getHabilitationLevel();

    return {
      proConnectSub: this.proConnectSub,
      idpId: this.idpId,
      domain: this.domain,
      email: this.email,
      familyName: this.familyName,
      firstName: this.firstName,
      fullName: this.familyName ? `${this.firstName} ${this.familyName}` : "",
      siret: this.siret,
      ...habilitationLevel,
    };
  }
}
