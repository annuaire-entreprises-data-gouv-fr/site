import { IProConnectUserInfo } from '#clients/authentication/pro-connect/strategy';
import { superAgentsList } from '#clients/authentication/super-agents';
import { Scopes } from '#models/authentication/agent/scopes';
import {
  NeedASiretException,
  PrestataireException,
} from '#models/authentication/authentication-exceptions';
import { Groups } from '#models/authentication/group/groups';
import { InternalError } from '#models/exceptions';
import { isSiret, verifySiret } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import { AgentOrganisation } from '../organisation';
import { defaultAgentScopes } from '../scopes/constants';

export class AgentConnected {
  private domain;
  private idpId;
  private email;
  private familyName;
  private firstName;
  private userId;
  private siret;

  constructor(userInfo: IProConnectUserInfo) {
    this.domain = this.extractDomain(userInfo?.email || '');
    this.idpId = userInfo.idp_id ?? '';
    this.email = userInfo.email ?? '';
    this.familyName = userInfo.family_name ?? '';
    this.firstName = userInfo.given_name ?? '';
    this.userId = userInfo.sub;

    const siretAsString = (userInfo.siret || '').replaceAll(' ', '');

    if (!siretAsString || !isSiret(siretAsString)) {
      throw new NeedASiretException(
        'The user doesn‘t have a siret',
        `${this.domain} - ${this.idpId}`
      );
    }

    this.siret = verifySiret(siretAsString);
  }

  extractDomain(email: string) {
    try {
      return (email.match(/@(.*)/) || ['']).shift() || '';
    } catch {
      return '';
    }
  }

  isLikelyPrestataire = () => {
    for (let bannedDomain of [
      'i-carre.net',
      'beta.gouv.fr',
      'code.gouv.fr',
      'data.gouv.fr',
      'demarches-simplifiees.fr',
      'entreprise.api.gouv.fr',
      'franceconnect.gouv.fr',
      'monstagedetroisieme.fr',
      'scn.rie.gouv.fr',
    ]) {
      if (this.domain.indexOf(bannedDomain) > -1) {
        return true;
      }
    }

    if (
      !!this.email.match(
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

    // exclude prestataire from getting habilitation
    if (this.isLikelyPrestataire()) {
      throw new PrestataireException(`${this.email} is a prestataire`);
    }

    return this.getOrganisationHabilitation();
  }

  async getAgentHabilitation() {
    const superAgentScopes = new Scopes();
    let drolesScopes: string[] = [];
    let s3Scopes: string[] = [];

    if (process.env.D_ROLES_ENABLED === 'enabled') {
      // Get scopes from Groups (D-Roles API) for this agent
      const groups = await Groups.find(this.email, this.userId);
      groups.forEach((group) => {
        drolesScopes.push(...group.scopes);
        superAgentScopes.add(group.scopes);
      });
    }

    // TEMP Get scopes from S3 storage for this agent
    const superAgentsListScopesRaw = await superAgentsList.getScopeForAgent(
      this.email
    );
    s3Scopes = [...superAgentsListScopesRaw];
    superAgentScopes.add(superAgentsListScopesRaw);

    // Compare scopes from D-Roles and S3, log differences to Sentry
    if (process.env.D_ROLES_ENABLED === 'enabled' && drolesScopes.length > 0) {
      const drolesScopesSet = new Set(drolesScopes);
      const s3ScopesSet = new Set(s3Scopes);

      const onlyInDroles = drolesScopes.filter(
        (scope) => !s3ScopesSet.has(scope)
      );
      const onlyInS3 = s3Scopes.filter((scope) => !drolesScopesSet.has(scope));

      if (onlyInDroles.length > 0 || onlyInS3.length > 0) {
        logWarningInSentry(
          new InternalError({
            message: 'Scope differences detected between D-Roles and S3',
            context: {
              details: JSON.stringify({
                id: this.userId,
                email: this.email,
                onlyInDroles: onlyInDroles,
                onlyInS3: onlyInS3,
                drolesScopes: drolesScopes,
                s3Scopes: s3Scopes,
              }),
            },
          })
        );
      }
    }

    if (superAgentScopes.hasScopes()) {
      return {
        scopes: [...defaultAgentScopes, ...superAgentScopes.scopes],
        userType: 'Super-agent connecté',
        isSuperAgent: true,
      };
    }
    return null;
  }

  async getOrganisationHabilitation() {
    const organisation = new AgentOrganisation(this.idpId, this.siret);
    return await organisation.getHabilitationLevel();
  }

  /**
   * Verify agent rights and extract all required agent informations
   * @returns
   */
  async getAndVerifyAgentInfo() {
    const habilitationLevel = await this.getHabilitationLevel();

    return {
      userId: this.userId,
      idpId: this.idpId,
      domain: this.domain,
      email: this.email,
      familyName: this.familyName,
      firstName: this.firstName,
      fullName: this.familyName ? `${this.firstName} ${this.familyName}` : '',
      siret: this.siret,
      ...habilitationLevel,
    };
  }
}
