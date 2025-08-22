import { getDatapassDemande } from '#clients/datapass';
import { HttpNotFound } from '#clients/exceptions';
import { Exception, FetchRessourceException } from '#models/exceptions';
import { Siret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { defaultAgentScopes } from '../agent/scopes/constants';

export class HabilitationVerificationFailedException extends Exception {
  constructor(args: { message?: any; context?: { slug: string } }) {
    super({
      name: 'HabilitationVerificationFailed',
      ...args,
    });
  }
}

export class Habilitation {
  private static mapDatapassScopesToIAgentScopes(habiliationData: any) {
    // const formUid = demande.form_uid;
    //   let scopesArray: IAgentScope[] = [];
    //   if (formUid === 'annuaire-des-entreprises-marches-publics') {
    //     scopesArray = marchePublicScopes;
    //   } else if (formUid === 'annuaire-des-entreprises-aides-publiques') {
    //     scopesArray = aidesPubliquesScopes;
    //   } else if (
    //     formUid === 'annuaire-des-entreprises-lutte-contre-la-fraude'
    //   ) {
    //     scopesArray = lutteContreLaFraudeScopes;
    //   } else if (
    //     formUid === 'annuaire-des-entreprises-subventions-associations'
    //   ) {
    //     scopesArray = subventionsAssociationsScopes;
    //   }

    return [...defaultAgentScopes];
  }

  static async verify(demandeId: number, userEmail: string) {
    try {
      const demande = await getDatapassDemande(demandeId);

      if (demande.state !== 'validated') {
        throw new HabilitationVerificationFailedException({
          message: `La demande d’habilitation ${demandeId} n’est pas validée`,
        });
      }

      const activeHabilitation = demande.habilitations.find(
        (h) => h.state === 'active'
      );

      if (!activeHabilitation) {
        throw new HabilitationVerificationFailedException({
          message: `Aucune habilitations n’est associée a cette demande`,
        });
      }

      if (userEmail !== demande.applicant?.email) {
        throw new HabilitationVerificationFailedException({
          message: `Seule la personne ayant remplit la demande peut l’utiliser pour créer un groupe`,
        });
      }

      const contractUrl = `${process.env.DATAPASS_URL}/instruction/demandes/${demandeId}`;
      const scopes = this.mapDatapassScopesToIAgentScopes(
        activeHabilitation.data
      );

      return {
        contractUrl,
        contractDescription: `DATAPASS : demande ${demandeId} | habilitation ${activeHabilitation.id}`,
        scopes,
        siret: activeHabilitation.organisation.siret as Siret,
      };
    } catch (error) {
      if (error instanceof HttpNotFound) {
        throw new HabilitationVerificationFailedException({
          message: `Cette demande n’existe pas`,
        });
      }
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'Datapass',
          message: 'Failed to verify habilitation',
          cause: error,
        })
      );
      throw error;
    }
  }
}
