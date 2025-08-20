import datapassClient from '#clients/datapass';
import { HttpNotFound } from '#clients/exceptions';
import {
  default as droleClient,
  default as rolesdataClient,
} from '#clients/roles-data';
import { IRolesDataUser } from '#clients/roles-data/interface';
import {
  aidesPubliquesScopes,
  IAgentScope,
  lutteContreLaFraudeScopes,
  marchePublicScopes,
  subventionsAssociationsScopes,
} from '#models/authentication/agent/scopes/constants';
import { FetchRessourceException } from '#models/exceptions';
import { logFatalErrorInSentry } from '#utils/sentry';

export type IRolesDataGroup = {
  name: string;
  id: number;
  organisation_siret: string;
  users: IRolesDataUser[];
  scopes: IAgentScope[];
  contract_description: string;
  contract_url?: string;
};

export class Groups {
  /**
   * Get all groups that a user belongs to
   */
  static async find(
    userEmail: string,
    userSub: string
  ): Promise<IRolesDataGroup[]> {
    try {
      return await rolesdataClient.getGroupsByEmail(userEmail, userSub);
    } catch (error) {
      if (error instanceof HttpNotFound) {
        // user not in roles.data
        return [];
      }

      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'Roles.data Groups',
          cause: error,
        })
      );

      return [];
    }
  }

  /**
   * Validate a group
   */
  static async validateNewGroup(
    userEmail: string,
    userSub: string,
    demandeId: number,
    groupName: string,
    emails?: string[]
  ): Promise<IDRolesGroup> {
    try {
      const demande = await datapassClient.getDemande(demandeId);

      if (demande.state !== 'validated') {
        throw new ValidationError({
          ressource: 'Groups',
          cause: new Error('Demande is not validated'),
        });
      }

      if (userEmail !== demande.applicant?.email) {
        throw new ValidationError({
          ressource: 'Groups',
          cause: new Error(
            'User email does not match the applicant email in the demande'
          ),
        });
      }

      const contractUrl = `${process.env.DATAPASS_URL}/instruction/demandes/${demandeId}`;
      const groups = await droleClient.getGroupByContractUrl(contractUrl);

      if (groups.length >= 1) {
        throw new ValidationError({
          ressource: 'Groups',
          cause: new Error('A group has already been created for this demande'),
        });
      }

      const formUid = demande.form_uid;
      let scopesArray: IAgentScope[] = [];
      if (formUid === 'annuaire-des-entreprises-marches-publics') {
        scopesArray = marchePublicScopes;
      } else if (formUid === 'annuaire-des-entreprises-aides-publiques') {
        scopesArray = aidesPubliquesScopes;
      } else if (
        formUid === 'annuaire-des-entreprises-lutte-contre-la-fraude'
      ) {
        scopesArray = lutteContreLaFraudeScopes;
      } else if (
        formUid === 'annuaire-des-entreprises-subventions-associations'
      ) {
        scopesArray = subventionsAssociationsScopes;
      }

      const body = {
        name: groupName,
        organisation_siret: demande.organisation?.siret,
        admin: {
          email: userEmail,
        },
        scopes: scopesArray.join(','),
        contract_url: contractUrl,
        contract_description: demande.definition_id,
        members: emails?.map((email) => ({
          email,
        })),
      };

      const newGroup = await droleClient.create(body, userSub);
      return {
        ...newGroup,
        scopes: scopesArray,
        contract_description: body.contract_description,
        contract_url: body.contract_url,
      };
    } catch (error) {
      // validation error are expected as user
      if (!(error instanceof ValidationError)) {
        logFatalErrorInSentry(
          new InternalError({
            ressource: 'New Group Validation',
            cause: error,
          })
        );
      }
      throw error;
    }
  }
}
